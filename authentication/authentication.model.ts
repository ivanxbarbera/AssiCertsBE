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
 * Data returned in the login response
 */
export interface LoginResponse {
  // generate token
  token: string;
  // token life duration in minutes
  expiresIn: number;
  // identifier of the logged user
  userId: string;
} // LoginResponse

/**
 * Data received in the login request
 */
export interface LoginRenewRequest {
  // identifier of the logged user
  userId: string;
  // token to be renewed
  token: string;
} // LoginRenewRequest

/**
 * Data received for authentication verify
 */
export interface AuthenticationParams {
  // Bearer ahtorization header field
  authorization: Header<'Authorization'>;
} // AuthenticationParams

/**
 * Data returned after authentication verify
 */
export interface AuthenticationData {
  // identifier of the logged user
  userID: string;
} // AutheticationData
