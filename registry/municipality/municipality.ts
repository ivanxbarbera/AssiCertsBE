// libraries
import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { secret } from 'encore.dev/config';
import axios from 'axios';
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { orm } from '../../common/db/db';
import {
  Municipality,
  MunicipalityList,
  MunicipalityListResponse,
  MunicipalitySync,
  MunicipalitySyncResponse,
  Nation,
  Province,
  Region,
} from './municipality.model';
import locz from '../../common/i18n';
import { AuthorizationOperationResponse } from '../../authorization/authorization.model';
import { authorizationOperationUserCheck } from '../../authorization/authorization';
import { DbUtility } from '../../common/utility/db.utility';

const municipalitiyIstatXlsFileUrl = secret('MunicipalitiyIstatXlsFileUrl');

/**
 * Process ISTAT excel file and update stored data.
 * @param filePath excel file input stream
 * @returns updating process results
 */
export const municipalityProcessIstatFile = async (stream: Readable): Promise<MunicipalitySyncResponse> => {
  // load current deprecated
  const currentDeprecated = (await orm('Municipality').where('deprecated', true).count())[0]['count'] as number;
  // start changes
  const trx = await orm.transaction();
  // init response
  const response: MunicipalitySyncResponse = {
    processed: 0,
    added: 0,
    deprecated: 0,
  };
  // update all current data as deprecated
  await trx('Municipality').update({ deprecated: true });
  await trx('Province').update({ deprecated: true });
  await trx('Region').update({ deprecated: true });
  // process stream data
  return new Promise((resolve, reject) => {
    // read excel stream data
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    // process stream data
    stream.on('end', async () => {
      try {
        const fileBuffer = Buffer.concat(chunks);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        // read data from the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // convert sheet to JSON excluding the first row (column headers)
        const header: string[] = Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i));
        const excelRows: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: header, range: 1 });
        // process excel data
        const currentData: {
          nation?: Nation;
          region?: Region;
          province?: Province;
          municipality?: Municipality;
        } = {};
        for (const excelRow of excelRows) {
          // get data from row
          response.processed++;
          const nationName: string = 'Italia';
          const nationCode: string = 'IT';
          const regionName: string = excelRow['K']?.toString().trim();
          const provinceName: string = excelRow['L']?.toString().trim();
          const provinceCode: string = excelRow['O']?.toString().trim();
          const municipalityName: string = excelRow['F']?.toString().trim();
          const municipalityCode: string = excelRow['T']?.toString().trim();
          // check data
          if (!nationName || !regionName || !provinceName || !provinceCode || !municipalityName || !municipalityCode) {
            console.warn('Skipping row with missing data');
            continue;
          }
          if (!currentData.nation || currentData.nation.name !== nationName) {
            // nation changed
            // load current nation
            let nation: Nation = await trx('Nation').where('code', nationCode).first();
            if (nation) {
              // nation exists, mark as not deprecated
              await trx('Nation').where('id', nation.id).update({ deprecated: false });
            } else {
              // nation not exist, add new one
              nation = {
                name: nationName,
                code: nationCode,
                deprecated: false,
              };
              const [rst] = await trx('Nation').insert(nation).returning('id');
              nation.id = rst.id;
            }
            // set current nation
            currentData.nation = nation;
          }
          if (!currentData.region || currentData.region.name !== regionName) {
            // region changed
            // load current region
            let region: Region = await trx('Region').where('name', regionName).andWhere('nationId', currentData.nation.id!).first();
            if (region) {
              // region exists, mark as not deprecated
              await trx('Region').where('id', region.id).update({ deprecated: false });
            } else {
              // region not exist, add new one
              region = {
                name: regionName,
                deprecated: false,
                nationId: currentData.nation.id!,
              };
              const [rst] = await trx('Region').insert(region).returning('id');
              region.id = rst.id;
            }
            // set current region
            currentData.region = region;
          }
          if (!currentData.province || currentData.province.name !== provinceName) {
            // province changed
            // load current province
            let province: Province = await trx('Province').where('name', provinceName).andWhere('regionId', currentData.region.id).first();
            if (province) {
              // province exists, mark as not deprecated
              await trx('Province').where('id', province.id).update({ deprecated: false });
            } else {
              // province not exist, add new one
              province = {
                name: provinceName,
                code: provinceCode,
                deprecated: false,
                regionId: currentData.region.id!,
              };
              const [rst] = await trx('Province').insert(province).returning('id');
              province.id = rst.id;
            }
            // set current province
            currentData.province = province;
          }
          if (!currentData.municipality || currentData.municipality.name !== municipalityName) {
            // municipality changed
            // load current municipality
            let municipality: Municipality = await trx('Municipality')
              .where('name', municipalityName)
              .andWhere('code', municipalityCode)
              .andWhere('provinceId', currentData.province.id)
              .first();
            if (municipality) {
              // municipality exists, mark as not deprecated
              await trx('Municipality').where('id', municipality.id).update({ deprecated: false });
            } else {
              // municipality not exist, add new one
              municipality = {
                name: municipalityName,
                code: municipalityCode,
                provinceId: currentData.province.id!,
                deprecated: false,
              };
              const [rst] = await trx('Municipality').insert(municipality).returning('id');
              municipality.id = rst.id;
              response.added++;
            }
            // set current municipality
            currentData.municipality = municipality;
          }
        }
        // all done, confirm changes
        await trx.commit();
        // load actual deprecated
        const actualDeprecated = (await orm('Municipality').where('deprecated', true).count())[0]['count'] as number;
        // update and return response
        response.deprecated = actualDeprecated - currentDeprecated;
        resolve(response);
      } catch (error) {
        // error occurred, reject changes
        await trx.rollback();
        reject(APIError.internal(locz().MUNICIPALITY_FILE_PROCESS_ERROR()));
      }
    });
    stream.on('error', (error) => {
      reject(APIError.internal(locz().MUNICIPALITY_FILE_GET_ERROR()));
    });
  });
}; // municipalityProcessIstatFile

/**
 * Fetch the ISTAT file from the given URL and process it.
 * @param url the url for downloading the ISTAT excel file
 * @returns updating process results
 */
export const municipalitySyncIstat = api(
  { expose: true, auth: true, method: 'POST', path: '/registry/municipality/sync/istat' },
  async (request: MunicipalitySync): Promise<MunicipalitySyncResponse> => {
    try {
      // open url stream for downloading file
      const urlResponse = await axios.get(request.url, { responseType: 'stream' });
      // process file and update municipality
      return await municipalityProcessIstatFile(urlResponse.data);
    } catch (error) {
      if (error instanceof APIError) {
        // error processing file
        throw error;
      }
      // error getting file
      throw APIError.internal(locz().MUNICIPALITY_FILE_GET_ERROR());
    }
  }
); // municipalitySyncIstat

/**
 * Sync municipality and related fetcing all available data.
 * @returns updating process results
 */
export const municipalitySync = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/sync' },
  async (): Promise<MunicipalitySyncResponse> => {
    // prepare response
    const response: MunicipalitySyncResponse = {
      processed: 0,
      added: 0,
      deprecated: 0,
    };
    // sync from istat xls file source
    const responseIstat = await municipalitySyncIstat({
      url: municipalitiyIstatXlsFileUrl(),
    });
    // update response
    response.processed += responseIstat.processed;
    response.added += responseIstat.added;
    response.deprecated += responseIstat.deprecated;
    // return response
    return response;
  }
); // municipalitySync

/**
 * Municipality list.
 * Load municipality list.
 */
export const municipalityList = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality' },
  async (): Promise<MunicipalityListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'municipalityList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load municipalities
    let municipalityQry = () => orm<MunicipalityList>('Municipality');
    const monicipalities: MunicipalityList[] = await municipalityQry()
      .join('Province', 'Province.id', 'Municipality.provinceId')
      .join('Region', 'Region.id', 'Province.regionId')
      .join('Nation', 'Nation.id', 'Region.nationId')
      .select(
        'Municipality.id as id',
        'Municipality.name as name',
        'Municipality.code as code',
        'Province.name as provinceName',
        'Province.code as provinceCode',
        'Region.name as regionName',
        'Nation.name as nationName',
        'Nation.code as nationCode'
      )
      .orderBy('Municipality.name', 'asc');
    return { municipalities: DbUtility.removeNullFieldsList(monicipalities) };
  }
); // municipalityList
