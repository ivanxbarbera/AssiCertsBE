import { Header } from 'encore.dev/api';

/**
 * Data received for authentication verify using Bearer
 */
export interface AuthenticationParams {
  // Bearer ahtorization header field
  authorizationBearer?: Header<'Authorization'>;
  authorizationCookie?: Header<'Cookie'>;
} // AuthenticationParams

/**
 * Data returned after authentication verify
 */
export interface AuthenticationData {
  // identifier of the logged user
  userID: string;
} // AutheticationData
//
