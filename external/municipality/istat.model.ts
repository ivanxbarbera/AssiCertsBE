/**
 * Municipality info loaded from ISTAT file.
 */
export interface IstatMunicipality {
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
} // IstatMunicipality

/**
 * ISTAT Municipality synchronization request.
 */
export interface IstatMunicipalitySync {
  // url for getting source municipality data file
  url: string;
} // IstatMunicipalitySync
