import { APIError, Gateway } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { secret } from 'encore.dev/config';
import { jwtVerify } from 'jose';
import cookie from 'cookie';
import { AuthenticationData, AuthenticationParams } from './authentication.model';
import locz from '../common/i18n';

/**
 * JWT Secret.
 */
const jwtSercretKey = secret('JWTSecretKey');

/**
 * Authentication handler.
 * Intercept authenticated API call and check for its validity.
 * Can manage either Bearer nor Cookie authentication.
 */
export const authenticationHandler = authHandler<AuthenticationParams, AuthenticationData>(async (params) => {
  if (params.authorizationBearer) {
    // check if token is valid
    // get the token from the header
    // this should be in the format "Bearer <token>"
    const bearerToken = params.authorizationBearer;
    // extract the token by removing the "Bearer " prefix
    const token = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : '';
    try {
      // extract payload from token
      const { payload } = await jwtVerify<AuthenticationData>(token, new TextEncoder().encode(jwtSercretKey()));
      // prepare authentication response
      const response: AuthenticationData = {
        userID: '' + payload.userID,
      };
      return response;
    } catch (exception) {
      // token verification error
      throw APIError.unauthenticated(locz().AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED());
    }
  } else if (params.authorizationCookie) {
    // get the token from cookie
    const cookies = cookie.parse(params.authorizationCookie);
    const token = cookies.auth ? cookies.auth! : '';
    try {
      // extract payload from token
      const { payload } = await jwtVerify<AuthenticationData>(token, new TextEncoder().encode(jwtSercretKey()));
      // prepare authentication response
      const response: AuthenticationData = {
        userID: '' + payload.userID,
      };
      return response;
    } catch (exception) {
      // token verification error
      throw APIError.unauthenticated(locz().AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED());
    }
  } else {
    // token cannot be renewed
    throw APIError.unauthenticated(locz().AUTHENTICATION_AUTHENTICATION_MALFORMED_REQUEST());
  }
}); // authenticationHandler

/**
 * Authentication gateway.
 */
export const gateway = new Gateway({
  authHandler: authenticationHandler,
}); // gateway
