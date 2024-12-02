import { APIError, Gateway } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { secret } from 'encore.dev/config';
import { jwtVerify } from 'jose';
import cookie from 'cookie';
import { AuthenticationData, AuthenticationParams } from './authentication.model';
import locz from '../common/i18n';
import { UserPasswordExpirationResponse } from '../user/user.model';
import { getUserPasswordExpiration } from '../user/user';

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
  // extract token from request
  let token = '';
  if (params.authorizationBearer) {
    // check if token is valid
    // get the token from the header
    // this should be in the format "Bearer <token>"
    const bearerToken = params.authorizationBearer;
    // extract the token by removing the "Bearer " prefix
    token = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : '';
  } else if (params.authorizationCookie) {
    // get the token from cookie
    const cookies = cookie.parse(params.authorizationCookie);
    token = cookies.auth ? cookies.auth! : '';
  } else {
    // token cannot be renewed
    throw APIError.unauthenticated(locz().AUTHENTICATION_AUTHENTICATION_MALFORMED_REQUEST());
  }
  try {
    // extract payload from token
    const { payload } = await jwtVerify<AuthenticationData>(token, new TextEncoder().encode(jwtSercretKey()));
    // prepare authentication response
    const response: AuthenticationData = {
      userID: '' + payload.userID,
    };
    // check password expiration
    const passwordEpiration: UserPasswordExpirationResponse = await getUserPasswordExpiration(parseInt(payload.userID));
    if (passwordEpiration.expired) {
      // user password expired
      throw APIError.permissionDenied(locz().AUTHENTICATION_AUTHENTICATION_PASSWORD_EXPIRED());
    }
    // return authentication data
    return response;
  } catch (exception) {
    // token verification error
    throw APIError.unauthenticated(locz().AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED());
  }
}); // authenticationHandler

/**
 * Authentication gateway.
 */
export const gateway = new Gateway({
  authHandler: authenticationHandler,
}); // gateway
