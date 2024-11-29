// libraries
import { api, APIError } from 'encore.dev/api';
import {
  PasswordCheckParameters,
  SMTPParameters,
  SystemParameter,
  SystemParameterRequest,
  SystemParameterResponse,
  SystemVersion,
  SystemVersionResponse,
} from './system.model';
import { orm } from '../common/db/db';
import { secret } from 'encore.dev/config';

const APPLICATION_VERSION: string = '0.0.1';
const APPLICATION_VERSION_DATE: Date = new Date(2024, 11 - 1, 14);

/**
 * Application version.
 * Returns current application version.
 */
export const systemVersion = api({ expose: true, method: 'GET', path: '/system/version' }, async (): Promise<SystemVersionResponse> => {
  // load data model version
  const systemVersionQry = () => orm<SystemVersion>('SystemVersion');
  const systemVersion = await systemVersionQry().first().orderBy('id', 'desc');
  if (!systemVersion) {
    throw APIError.internal('Error getting datamodel version');
  }
  return {
    applicationVersion: APPLICATION_VERSION,
    applicationVersionDate: APPLICATION_VERSION_DATE,
    dataModelVersion: systemVersion.version,
    dataModelVersionDate: systemVersion.versionDate,
  };
}); // systemVersion

/**
 * System parameter.
 * Load system parameters based on given group and code (optional).
 */
export const systemParameter = api(
  { expose: false, method: 'GET', path: '/system/parameter' },
  async (request: SystemParameterRequest): Promise<SystemParameterResponse> => {
    // load system parametes
    let systemParameterQry = () => orm<SystemParameter>('SystemParameter');
    systemParameterQry().where('group', request.group);
    if (request.code) {
      systemParameterQry().where('code', request.code);
    }
    const systemParameters = await systemParameterQry().select();
    return { systemParameters };
  }
); // systemParameter

/**
 * Convert a list of system parameters into an object with typed property for each parameter.
 * The property are named with 'group'_'code' of each paramter.
 * Example:
 *   input parameters:
 *     - group 'GR1', code 'FIRST', type 'STRING', value 'string value'
 *     - group 'GR1', code 'SECOND', type 'NUMBER', value '100'
 *     - group 'GR2', code 'FIRST', type 'DECIMAL', value '120.50'
 *     - group 'GR2', code 'SECOND', type 'BOOLEAN', value 'true'
 *     - group 'GR2', code 'THIRD', type 'DATE', value '2024-11-01'
 *   output object:
 *     {
 *        GR1_FIRST: 'string value',
 *        GR1_SECOND: 100,
 *        GR2_FIRST: 120.5,
 *        GR2_SECOND: true,
 *        GR3_THIRD: Date(2024, 10, 1)
 *     }
 * @param systemParameters pramters to be converted
 * @returns object with parameters as properties
 */
export const systemParameterToObject = (systemParameters: SystemParameter[]): any => {
  const paramtersObject: { [k: string]: any } = {};
  systemParameters.map((systemParameter: SystemParameter) => {
    switch (systemParameter.type) {
      case 'TEXT':
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = systemParameter.value;
        break;
      case 'NUMBER':
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = parseInt(systemParameter.value);
        break;
      case 'DECIMAL':
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = parseFloat(systemParameter.value);
        break;
      case 'BOOLEAN':
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = systemParameter.value.toLowerCase() === 'true';
        break;
      case 'DATE':
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = new Date(systemParameter.value);
        break;
      default:
        paramtersObject[systemParameter.group + '_' + systemParameter.code] = systemParameter.value;
    }
  });
  return paramtersObject;
}; // filterSystemParameterByCode

// SMTP Environments
const mailSMTPHost: string = secret('MailSMTPHost')();
const mailSMTPPort: number = parseInt(secret('MailSMTPPort')());
const mailSMTPSecure: boolean = secret('MailSMTPSecure')() === 'true';
const mailSMTPAuthentication: boolean = secret('MailSMTPAuthentication')() === 'true';
const mailSMTPAuthenticationUsername: string = secret('MailSMTPAuthenticationUsername')();
const mailSMTPAuthenticationPassword: string = secret('MailSMTPAuthenticationPassword')();
const mailSMTPAuthenticationDefaultSender: string = secret('MailSMTPAuthenticationDefaultSender')();
const mailSMTPAuthenticationSubjectPrefix: string = secret('MailSMTPAuthenticationSubjectPrefix')();

/**
 * SMTP parameters.
 * Load SMTP configuration stored in system parameters.
 */
export const systemParametersSmtp = api({ expose: false, method: 'GET', path: '/system/parameters/smtp' }, async (): Promise<SMTPParameters> => {
  // create smtp paramters
  return {
    host: mailSMTPHost,
    port: mailSMTPPort,
    secure: mailSMTPSecure,
    authentication: mailSMTPAuthentication,
    authenticationUsername: mailSMTPAuthenticationUsername,
    authenticationPassowrd: mailSMTPAuthenticationPassword,
    defaultSender: mailSMTPAuthenticationDefaultSender,
    subjectPrefix: mailSMTPAuthenticationSubjectPrefix,
  };
}); // systemParametersSmtp

/**
 * Password check paramters.
 * Load password check parameter configuration stored in system parameters
 */
export const systemParametersPasswordCheck = api(
  { expose: false, method: 'GET', path: '/system/parameters/password-check' },
  async (): Promise<PasswordCheckParameters> => {
    // load smtp parameters from system parameters
    const response: SystemParameterResponse = await systemParameter({ group: 'PASSWORD_CHECK' });
    // convert system parameters to single object
    const passwordCheckParametersObject = systemParameterToObject(response.systemParameters);
    // create smtp paramters
    return {
      minLength: passwordCheckParametersObject.PASSWORD_CHECK_MIN_LENGTH,
      minLowerLetters: passwordCheckParametersObject.PASSWORD_CHECK_MIN_LOWER_LETTERS,
      minUpperLetters: passwordCheckParametersObject.PASSWORD_CHECK_MIN_UPPER_LETTERS,
      minNumbers: passwordCheckParametersObject.PASSWORD_CHECK_MIN_NUMBERS,
      minSpecials: passwordCheckParametersObject.PASSWORD_CHECK_MIN_SPECIALS,
      historyUnusable: passwordCheckParametersObject.PASSWORD_CHECK_HISTORY_UNUSABLE,
      expirationDays: passwordCheckParametersObject.PASSWORD_CHECK_EXPIRATION_DAYS,
    };
  }
); // systemParametersPasswordCheck
