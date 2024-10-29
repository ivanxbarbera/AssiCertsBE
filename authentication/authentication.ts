import { Gateway, Header } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { secret } from 'encore.dev/config';
import { jwtVerify } from 'jose';

/**
 * JWT Secret.
 */
const jwtSercretKey = secret('JWTSecretKey');

/**
 * Data received for authentication verify
 */
interface AuthenticationParams {
  authorization: Header<'Authorization'>;
} // AuthenticationParams

/**
 * Data returned after authentication verify
 */
export interface AuthenticationData {
  userID: string;
} // AutheticationData

/**
 * Authentication handler.
 * Intercept authenticated API call and check for its validity.
 */
export const authenticationHandler = authHandler<AuthenticationParams, AuthenticationData>(async (params) => {
  // check if token is valid
  // get the token from the header
  // TODO MIC explode token from Bearer
  const token = params.authorization;
  // extract payload from token
  const { payload } = await jwtVerify<AuthenticationData>(token, new TextEncoder().encode(jwtSercretKey()));
  // prepare authentication response  
  const response: AuthenticationData = {
    userID: "" + payload.userID
  };
  return response;
}); // authenticationHandler

/**
 * Authentication gateway.
 */
export const gateway = new Gateway({
  authHandler: authenticationHandler,
}); // gateway
