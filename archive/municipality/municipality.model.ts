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
  // parameter indentifier
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
