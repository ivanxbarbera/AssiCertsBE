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
 * Nation for update.
 */
export interface NationEditRequest {
  // nation identified
  id?: number;
  // nation name
  name: string;
  // nation code
  code?: string;
} // NationEditRequest

/**
 * Nation returned in list.
 */
export interface NationList {
  // nation identified
  id: number;
  // nation name
  name: string;
  // nation code
  code: string;
  // nation status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
} // NationList

/**
 * Nation list response.
 */
export interface NationListResponse {
  // nation list
  nations: NationList[];
} // NationListResponse

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
 * Region for update.
 */
export interface RegionEditRequest {
  // region identified
  id?: number;
  // region name
  name: string;
  // nation
  nation: NationEditRequest;
} // RegionEditRequest

/**
 * Region returned in list.
 */
export interface RegionList {
  // region identified
  id: number;
  // region name
  name: string;
  // region status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
} // RegionList

/**
 * Region list request parameters.
 */
export interface RegionListRequest {
  // nation identifier
  nationId?: number;
} // RegionListRequest

/**
 * Region list response.
 */
export interface RegionListResponse {
  // region list
  regions: RegionList[];
} // RegionListResponse

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
 * Province for update.
 */
export interface ProvinceEditRequest {
  // province identified
  id?: number;
  // province name
  name: string;
  // region code
  code?: string;
  // region
  region: RegionEditRequest;
} // ProvinceEditRequest

/**
 * Province returned in list.
 */
export interface ProvinceList {
  // province identified
  id: number;
  // province name
  name: string;
  // region code
  code: string;
  // province status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
} // ProvinceList

/**
 * Province list request parameters.
 */
export interface ProvinceListRequest {
  // region identifier
  regionId?: number;
  // nation identifier
  nationId?: number;
} // ProvinceListRequest

/**
 * Province list response.
 */
export interface ProvinceListResponse {
  // region list
  provinces: ProvinceList[];
} // ProvinceListResponse

/**
 * Municipality.
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
 * Municipality for update.
 */
export interface MunicipalityEditRequest {
  // municipality identified
  id?: number;
  // municipality name
  name: string;
  // minucipality code
  code?: string;
  // province
  province: ProvinceEditRequest;
} // Municipality

/**
 * Municipality returned in list.
 */
export interface MunicipalityList {
  // municipality identified
  id: number;
  // municipality name
  name: string;
  // minucipality code
  code?: string;
  // municipality status, if true removed but maintained for historical reasons, otherwise already active
  deprecated: boolean;
} // MunicipalityList

/**
 * Municipality list request parameters.
 */
export interface MunicipalityListRequest {
  // province identifier
  provinceId?: number;
} // MunicipalityListRequest

/**
 * Municipality list response.
 */
export interface MunicipalityListResponse {
  // municipality list
  municipalities: MunicipalityList[];
} // MunicipalityListResponse

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
 * Municipality list item with complete data.
 */
export interface MunicipalityCompleteList {
  // municipality indentifier
  id: number;
  // municipality name
  name: string;
  // municipality code
  code: string;
  // province identifier
  provinceId: number;
  // province name
  provinceName: string;
  // province code
  provinceCode: string;
  // region identifier
  regionId: number;
  // region name
  regionName: string;
  // nation identifier
  nationId: number;
  // nation name
  nationName: string;
  // nation code
  nationCode: string;
} // MunicipalityCompleteList

/**
 * Municipality response for loaded values with complete data.
 */
export interface MunicipalityCompleteListResponse {
  // municipality list
  municipalities: MunicipalityCompleteList[];
} // MunicipalityCompleteListResponse

/**
 * Municipality info loaded from external service.
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
