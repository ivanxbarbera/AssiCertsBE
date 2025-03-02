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
  group?: string;
  // parameter code
  code?: string;
} // SystemParameterListRequest

/**
 * System parameter response for loaded parameter values.
 */
export interface SystemParameterResponse {
  // system parameters list
  systemParameters: SystemParameter[];
} // SystemParameterResponse

/**
 * System parameter list.
 */
export interface SystemParameterList {
  // parameter indentifier
  id: number;
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
 * System parameter response for loaded parameter values.
 */
export interface SystemParameterListResponse {
  // paramters list
  systemParameters: SystemParameterList[];
} // SystemParameterListResponse

/**
 * System parameter edit request.
 */
export interface SystemParameterEditRequest {
  // parameter indentifier
  id: number;
  // parameter value
  value: string;
} // SystemParameterEditRequest

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

/**
 * SMPT server configuration parameters.
 */
export interface PasswordCheckParameters {
  // password min length
  minLength: number;
  // password min lower case letters number
  minLowerLetters: number;
  // password min upper case letters number
  minUpperLetters: number;
  // password min numbers number
  minNumbers: number;
  // password min special characters number
  minSpecials: number;
  // password historyc unusable number
  historyUnusable: number;
  // password expiration in days
  expirationDays: number;
  // password notification before expiration in days
  expirationNotificationDays: number;
} // PasswordCheckParameters

/**
 * User configuration parameters.
 */
export interface UserCheckParameters {
  // user email allowed domains
  allowedDomains: string[];
} // UserCheckParameters
