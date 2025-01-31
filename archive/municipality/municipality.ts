// libraries
import { secret } from 'encore.dev/config';
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { orm } from '../../common/db/db';
import {
  Municipality,
  MunicipalityData,
  MunicipalityList,
  MunicipalityListResponse,
  MunicipalitySyncResponse,
  Nation,
  Province,
  Region,
} from './municipality.model';
import locz from '../../common/i18n';
import { AuthorizationOperationResponse } from '../../authorization/authorization.model';
import { authorizationOperationUserCheck } from '../../authorization/authorization';
import { DbUtility } from '../../common/utility/db.utility';
import { istatMunicipalitySync } from '../../external/municipality/istat';

const municipalitiyIstatXlsFileUrl = secret('MunicipalitiyIstatXlsFileUrl');

/**
 * Process ISTAT excel file and update stored data.
 * @param filePath excel file input stream
 * @returns updating process results
 */
export const municipalityProcessData = async (municipalityDatas: MunicipalityData[]): Promise<MunicipalitySyncResponse> => {
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
  try {
    // process municipality data
    const currentData: {
      nation?: Nation;
      region?: Region;
      province?: Province;
      municipality?: Municipality;
    } = {};
    for (const municipalityData of municipalityDatas) {
      // get data from row
      response.processed++;
      // check data
      if (
        !municipalityData.nationName ||
        !municipalityData.regionName ||
        !municipalityData.provinceName ||
        !municipalityData.provinceCode ||
        !municipalityData.municipalityName ||
        !municipalityData.municipalityCode
      ) {
        console.warn('Skipping row with missing data');
        continue;
      }
      if (!currentData.nation || currentData.nation.name !== municipalityData.nationName) {
        // nation changed
        // load current nation
        let nation: Nation = await trx('Nation').where('code', municipalityData.nationCode).first();
        if (nation) {
          // nation exists, mark as not deprecated
          await trx('Nation').where('id', nation.id).update({ deprecated: false });
        } else {
          // nation not exist, add new one
          nation = {
            name: municipalityData.nationName,
            code: municipalityData.nationCode,
            deprecated: false,
          };
          const [rst] = await trx('Nation').insert(nation).returning('id');
          nation.id = rst.id;
        }
        // set current nation
        currentData.nation = nation;
      }
      if (!currentData.region || currentData.region.name !== municipalityData.regionName) {
        // region changed
        // load current region
        let region: Region = await trx('Region').where('name', municipalityData.regionName).andWhere('nationId', currentData.nation.id!).first();
        if (region) {
          // region exists, mark as not deprecated
          await trx('Region').where('id', region.id).update({ deprecated: false });
        } else {
          // region not exist, add new one
          region = {
            name: municipalityData.regionName,
            deprecated: false,
            nationId: currentData.nation.id!,
          };
          const [rst] = await trx('Region').insert(region).returning('id');
          region.id = rst.id;
        }
        // set current region
        currentData.region = region;
      }
      if (!currentData.province || currentData.province.name !== municipalityData.provinceName) {
        // province changed
        // load current province
        let province: Province = await trx('Province')
          .where('name', municipalityData.provinceName)
          .andWhere('regionId', currentData.region.id)
          .first();
        if (province) {
          // province exists, mark as not deprecated
          await trx('Province').where('id', province.id).update({ deprecated: false });
        } else {
          // province not exist, add new one
          province = {
            name: municipalityData.provinceName,
            code: municipalityData.provinceCode,
            deprecated: false,
            regionId: currentData.region.id!,
          };
          const [rst] = await trx('Province').insert(province).returning('id');
          province.id = rst.id;
        }
        // set current province
        currentData.province = province;
      }
      if (!currentData.municipality || currentData.municipality.name !== municipalityData.municipalityName) {
        // municipality changed
        // load current municipality
        let municipality: Municipality = await trx('Municipality')
          .where('name', municipalityData.municipalityName)
          .andWhere('code', municipalityData.municipalityCode)
          .andWhere('provinceId', currentData.province.id)
          .first();
        if (municipality) {
          // municipality exists, mark as not deprecated
          await trx('Municipality').where('id', municipality.id).update({ deprecated: false });
        } else {
          // municipality not exist, add new one
          municipality = {
            name: municipalityData.municipalityName,
            code: municipalityData.municipalityCode,
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
    return response;
  } catch (error) {
    // error occurred, reject changes
    await trx.rollback();
    if (error instanceof APIError) {
      // error processing file
      throw error;
    }
    // error getting file
    throw APIError.internal(locz().MUNICIPALITY_DATA_PROCESS_ERROR());
  }
}; // municipalityProcessData

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
    // load data from istat xls file source
    const municipalityDatas = await istatMunicipalitySync({
      url: municipalitiyIstatXlsFileUrl(),
    });
    // sync municipality data
    const responseMunicipalityProcessData = await municipalityProcessData(municipalityDatas);
    // update response
    response.processed += responseMunicipalityProcessData.processed;
    response.added += responseMunicipalityProcessData.added;
    response.deprecated += responseMunicipalityProcessData.deprecated;
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
    const municipalities: MunicipalityList[] = await orm<MunicipalityList>('Municipality')
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
    return { municipalities: DbUtility.removeNullFieldsList(municipalities) };
  }
); // municipalityList
