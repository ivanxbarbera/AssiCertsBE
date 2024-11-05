import { Header } from 'encore.dev/api';

/**
 * Data received in the login request
 */
export interface LoginRequest {
  username: string;
  password: string;
} // LoginRequest

/**
 * Data returned in the login response
 */
export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
} // LoginResponse

/**
 * Data received in the login request
 */
export interface LoginRenewRequest {
  userId: string;
  token: string;
} // LoginRenewRequest

/**
 * Data received for authentication verify
 */
export interface AuthenticationParams {
  authorization: Header<'Authorization'>;
} // AuthenticationParams

/**
 * Data returned after authentication verify
 */
export interface AuthenticationData {
  userID: string;
} // AutheticationData
