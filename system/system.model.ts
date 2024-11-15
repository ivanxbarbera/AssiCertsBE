import { systemParameter } from './system';
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

/**
 * System parameter.
 */
export interface SystemParameter {
  id: number;
  group: string;
  code: string;
  name: string;
  type: string;
  value: string;
  description: string;
} // SystemParameter

/**
 * System parameter request for loading parameter values.
 */
export interface SystemParameterRequest {
  group: string;
  code?: string;
} // SystemParameterRequest

/**
 * System parameter response for loaded parameter values.
 */
export interface SystemParameterResponse {
  systemParameters: SystemParameter[];
} // SystemParameterResponse

/**
 * SMPT server configuration parameters.
 */
export interface SMTPParameters {
  host: string;
  port: number;
  secure: boolean;
  authentication: boolean;
  authenticationUsername: string;
  authenticationPassowrd: string;
} // SMTPParameters
