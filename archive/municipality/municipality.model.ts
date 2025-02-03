/**
 * Nation.
 */
export interface Nation {
  // nation identified
  id?: number;
  // nation name
  name: string;
  // nation code
  code?: string;
  // nation status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
} // Nation

/**
 * Region.
 */
export interface Region {
  // region identified
  id?: number;
  // region name
  name: string;
  // region status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
  // nation identifier
  nationId: number;
} // Region

/**
 * Province.
 */
export interface Province {
  // province identified
  id?: number;
  // province name
  name: string;
  // region code
  code?: string;
  // province status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
  // region identifier
  regionId: number;
} // Province

/**
 * Region.
 */
export interface Municipality {
  // municipality identified
  id?: number;
  // municipality name
  name: string;
  // minucipality code
  code?: string;
  // municipality status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
  // province identifier
  provinceId: number;
} // Municipality

/**
 * Municipality synchronization response.
 */
export interface MunicipalitySyncResponse {
  // number of municipality processed
  processed: number;
  // number of new municipality added
  added: number;
  // number of existing municipality deprecated
  deprecated: number;
} // MunicipalitySyncResponse

/**
 * Municipality list item.
 */
export interface MunicipalityList {
  // municipality indentifier
  id: number;
  // municipality name
  name: string;
  // municipality code
  code: string;
  // province name
  provinceName: string;
  // province code
  provinceCode: string;
  // region name
  regionName: string;
  // nation name
  nationName: string;
  // nation code
  nationCode: string;
} // SystemMunicipalityList

/**
 * System municipality response for loaded values.
 */
export interface MunicipalityListResponse {
  // municipality list
  municipalities: MunicipalityList[];
} // SystemMunicipalityListResponse

/**
 * Municipality info loaded from exzternal service.
 */
export interface MunicipalityData {
  // nation name
  nationName: string;
  // nation code
  nationCode: string;
  // region name
  regionName: string;
  // province name
  provinceName: string;
  // province code
  provinceCode: string;
  // municipiality name
  municipalityName: string;
  // municipality code
  municipalityCode: string;
} // MunicipalityData

/**
 * Request for nation details.
 */
export interface NationRequest {
  // nation unique identifier
  id: number;
} // NationRequest

/**
 * Request for region details.
 */
export interface RegionRequest {
  // region unique identifier
  id: number;
} // RegionRequest

/**
 * Request for province details.
 */
export interface ProvinceRequest {
  // province unique identifier
  id: number;
} // ProvinceRequest

/**
 * Request for municipality details.
 */
export interface MunicipalityRequest {
  // monicipality unique identifier
  id: number;
} // MunicipalityRequest

/**
 * Nation returned to caller
 */
export interface NationResponse {
  // nation indentifier
  id: number;
  // nation name
  name: string;
  // nation code
  code?: string;
} // NationResponse

/**
 * Region returned to caller
 */
export interface RegionResponse {
  // region indentifier
  id: number;
  // region name
  name: string;
  // region nation
  nation: NationResponse;
} // RegionResponse

/**
 * Province returned to caller
 */
export interface ProvinceResponse {
  // province indentifier
  id: number;
  // province name
  name: string;
  // province code
  code?: string;
  // province region
  region: RegionResponse;
} // ProvinceResponse

/**
 * Municipality returned to caller.
 */
export interface MunicipalityResponse {
  // muinicipality indentifier
  id: number;
  // municipality name
  name: string;
  // municipality code
  code?: string;
  // province
  province: ProvinceResponse;
} // MunicipalityResponse
