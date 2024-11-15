/**
 * System data model data.
 */
export interface SystemVersion {
  id: number;
  version: string;
  versionDate: Date;
} // System

/**
 * System versione response
 */
export interface SystemVersionResponse {
  applicationVersion: string;
  applicationVersionDate: Date;
  dataModelVersion: string;
  dataModelVersionDate: Date;
} // SystemVersionResponse
