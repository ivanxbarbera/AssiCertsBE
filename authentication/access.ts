import { api, APIError } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
import { jwtVerify, SignJWT } from 'jose';
import { AuthenticationData, LoginRenewRequest, LoginRequest, LoginResponse } from './authentication.model';

/**
 * JWT Secret.
 */
const jwtSercretKey = secret('JWTSecretKey');
const jwtDurationInSeconds = secret('JWTDurationInMinute');

/**
 * Login API.
 * Request for login posted by the client.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const login = api({ expose: true, method: 'POST', path: '/login' }, async (request: LoginRequest): Promise<LoginResponse> => {
  // TODO MIC check user credentials
  const userAllowed = request.username == 'admin' && request.password == 'secret';
  const userId = '3939032';
  if (userAllowed) {
    // user allowed to access
    // generate token
    const expiresIn: number = +jwtDurationInSeconds();
    const token: string = await new SignJWT({ userID: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn + 'minute')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    // prepare response
    const response: LoginResponse = { token, expiresIn, userId };
    return response;
  } else {
    // user not allowed to access
    throw APIError.permissionDenied('Unknown user');
  }
}); // login

/**
 * Login API.
 * Request for login posted by the client.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const loginRenew = api(
  { expose: true, auth: true, method: 'POST', path: '/login/renew' },
  async (request: LoginRenewRequest): Promise<LoginResponse> => {
    // get data from request
    // extract payload from token
    const { payload } = await jwtVerify<AuthenticationData>(request.token, new TextEncoder().encode(jwtSercretKey()));
    const userId = payload.userID;
    if (userId === request.userId) {
      // user allowed to access
      // generate new token
      const expiresIn: number = +jwtDurationInSeconds();
      const token: string = await new SignJWT({ userID: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn + 'minute')
        .sign(new TextEncoder().encode(jwtSercretKey()));
      // prepare response
      const response: LoginResponse = { token, expiresIn, userId };
      return response;
    } else {
      // token cannot be renewed
      throw APIError.permissionDenied('Invalid token');
    }
  }
); // login
