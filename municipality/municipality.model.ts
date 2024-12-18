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
 * Municipality synchronization request.
 */
export interface MunicipalitySync {
  // url for getting source municipality data file
  url: string;
} // MunicipalitySync

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
