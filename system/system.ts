// libraries
import { api, APIError } from 'encore.dev/api';
import { System, SystemVersionResponse } from './system.model';
import { orm } from '../common/db/db';

const APPLICATION_VERSION: string = '0.0.1';
const APPLICATION_VERSION_DATE: Date = new Date(2024, 11 - 1, 14);

/**
 * Application version.
 * Returns current application version.
 */
export const systemVersion = api({ expose: true, method: 'GET', path: '/system/version' }, async (): Promise<SystemVersionResponse> => {
  // load data model version
  const usersQry = () => orm<System>('System');
  const system = await usersQry().first().orderBy('id', 'desc');
  if (!system) {
    throw APIError.internal('Error getting datamodel version');
  }
  return {
    applicationVersion: APPLICATION_VERSION,
    applicationVersionDate: APPLICATION_VERSION_DATE,
    dataModelVersion: system.version,
    dataModelVersionDate: system.versionDate,
  };
}); // systemVersion
