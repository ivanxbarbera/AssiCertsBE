import { Header } from 'encore.dev/api';

/**
 * Data received in the login request
 */
export interface LoginRequest {
  // user email
  email: string;
  // user password
  password: string;
} // LoginRequest

/**
 * Data returned in the login response using cookie authentication.
 */
export interface LoginCookieResponse {
  // token life duration in minutes
  expiresIn: number;
  // identifier of the logged user
  userId: number;
} // LoginCookieResponse

/**
 * Data returned in the login response using Bearer authentication.
 */
export interface LoginBearerResponse {
  // generate token
  token: string;
  // token life duration in minutes
  expiresIn: number;
  // identifier of the logged user
  userId: number;
} // LoginBearerResponse

/**
 * Data received in the login request
 */
export interface LoginRenewBearerRequest {
  // identifier of the logged user
  userId: number;
  // token to be renewed
  token: string;
} // LoginRenewBearerRequest

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

/**
 * User loaded for authentication check.
 */
export interface AuthenticationUser {
  // user indentifie
  id: number;
  // user email
  email: string;
  // user encrypted password
  passwordHash: string;
} // AuthenticationUser
