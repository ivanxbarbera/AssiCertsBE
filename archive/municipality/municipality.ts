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
  MunicipalityRequest,
  MunicipalityResponse,
  MunicipalitySyncResponse,
  Nation,
  NationRequest,
  NationResponse,
  Province,
  ProvinceRequest,
  ProvinceResponse,
  Region,
  RegionRequest,
  RegionResponse,
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
 * Municipality complete list.
 * Load municipality list with complete data.
 */
export const municipalityCompleteList = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/complete' },
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
        'Province.id as provinceId',
        'Province.name as provinceName',
        'Province.code as provinceCode',
        'Region.id as regionId',
        'Region.name as regionName',
        'Nation.id as nationId',
        'Nation.name as nationName',
        'Nation.code as nationCode'
      )
      .orderBy('Municipality.name', 'asc');
    return { municipalities: DbUtility.removeNullFieldsList(municipalities) };
  }
); // municipalityCompleteList

/**
 * Load nation details.
 */
export const nationDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/nation/:id' },
  async (request: NationRequest): Promise<NationResponse> => {
    // load nation
    const nation = await orm<Nation>('Nation').first().where('id', request.id);
    if (!nation) {
      // nation not found
      throw APIError.notFound(locz().NATION_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'nationDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // prepare response
    const response: NationResponse = {
      id: nation.id!,
      name: nation.name,
      code: nation.code,
    };
    // return nation
    return DbUtility.removeNullFields(response);
  }
); // nationDetail

/**
 * Load region details.
 */
export const regionDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/region/:id' },
  async (request: RegionRequest): Promise<RegionResponse> => {
    // load region
    const region = await orm<Region>('Region').first().where('id', request.id);
    if (!region) {
      // region not found
      throw APIError.notFound(locz().REGION_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'regionDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // prepare response
    const response: RegionResponse = {
      id: region.id!,
      name: region.name,
      nation: await nationDetail({ id: region.nationId }),
    };
    // return region
    return DbUtility.removeNullFields(response);
  }
); // regionDetail

/**
 * Load province details.
 */
export const provinceDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/province/:id' },
  async (request: ProvinceRequest): Promise<ProvinceResponse> => {
    // load province
    const province = await orm<Province>('Province').first().where('id', request.id);
    if (!province) {
      // province not found
      throw APIError.notFound(locz().PROVINCE_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'provinceDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // prepare response
    const response: ProvinceResponse = {
      id: province.id!,
      code: province.code,
      name: province.name,
      region: await regionDetail({ id: province.regionId }),
    };
    // return province
    return DbUtility.removeNullFields(response);
  }
); // provinceDetail

/**
 * Load municipality details.
 */
export const municipalityDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/registry/municipality/:id' },
  async (request: MunicipalityRequest): Promise<MunicipalityResponse> => {
    // load municipality
    const municipality = await orm<Municipality>('Municipality').first().where('id', request.id);
    if (!municipality) {
      // municipality not found
      throw APIError.notFound(locz().MUNICIPALITY_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'municipalityDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // prepare response
    const response: MunicipalityResponse = {
      id: municipality.id!,
      code: municipality.code,
      name: municipality.name,
      province: await provinceDetail({ id: municipality.provinceId }),
    };
    // return municipality
    return DbUtility.removeNullFields(response);
  }
); // municipalityDetail
