import { systemParameter } from './system';
/**
 * System data model data.
 */
export interface SystemVersion {
  // versioni identifier
  id: number;
  // version number
  version: string;
  // version date
  versionDate: Date;
} // System

/**
 * System versione response
 */
export interface SystemVersionResponse {
  // application version number
  applicationVersion: string;
  // application version date
  applicationVersionDate: Date;
  // data model version number
  dataModelVersion: string;
  // data model version date
  dataModelVersionDate: Date;
} // SystemVersionResponse

/**
 * System parameter.
 */
export interface SystemParameter {
  // parameter indentifier
  id: number;
  // parametergroup code
  group: string;
  // parameter code
  code: string;
  // parameter name
  name: string;
  // parameter type
  type: string;
  // parameter value
  value: string;
  // parameter description
  description: string;
} // SystemParameter

/**
 * System parameter request for loading parameter values.
 */
export interface SystemParameterRequest {
  // parameter group code
  group: string;
  // parameter code
  code?: string;
} // SystemParameterRequest

/**
 * System parameter response for loaded parameter values.
 */
export interface SystemParameterResponse {
  // paramters list
  systemParameters: SystemParameter[];
} // SystemParameterResponse

/**
 * SMPT server configuration parameters.
 */
export interface SMTPParameters {
  // SMTP host name or address
  host: string;
  // SMTP host port
  port: number;
  // SMTP secure connection
  secure: boolean;
  // SMTP autentication required
  authentication: boolean;
  // SMTP authentication username
  authenticationUsername: string;
  // SMTP authentication password
  authenticationPassowrd: string;
  // SMTP mail default sender
  defaultSender: string;
  // SMTP mail subject prefix
  subjectPrefix: string;
} // SMTPParameters
