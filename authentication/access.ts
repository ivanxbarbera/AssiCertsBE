// libraries
import { api, APIError } from 'encore.dev/api';
import { jwtVerify, SignJWT } from 'jose';
import { orm } from '../common/db/db';
import bcrypt from 'bcryptjs';
import { IncomingMessage, ServerResponse } from 'http';
// application modules
import { AuthenticationData } from './authentication.model';
import { AuthenticationUser, LoginRenewBearerRequest, LoginRequest, LoginBearerResponse, LoginCookieResponse } from './access.model';
import { secret } from 'encore.dev/config';
import { userStatusUnlock } from '../user/user';
import locz from '../common/i18n';

const jwtSercretKey = secret('JWTSecretKey');
const jwtDurationInSeconds = secret('JWTDurationInMinute');

/**
 * User login with Bearer JWT.
 * Request for user authentication, using JWT in Bearer Header.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const loginBearer = api({ expose: true, method: 'POST', path: '/login' }, async (request: LoginRequest): Promise<LoginBearerResponse> => {
  // load user profile data
  const authenticationQry = () => orm<AuthenticationUser>('User');
  const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('email', request.email).where('disabled', false);
  const userAllowed = authentication && bcrypt.compareSync(request.password, authentication.passwordHash);
  if (userAllowed) {
    // user allowed to access
    const userId = authentication.id;
    // unlock user status
    await userStatusUnlock(userId);
    // generate token
    const expiresIn: number = +jwtDurationInSeconds();
    const token: string = await new SignJWT({ userID: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn + 'minute')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    // prepare response
    const response: LoginBearerResponse = { token, expiresIn, userId };
    return response;
  } else {
    // user not allowed to access
    throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_UNKNOWN_USER());
  }
}); // loginBearer

/**
 * User login with Cookie JWT.
 * Request for user authentication, using JWT in an HttpOnly cookie.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const loginCookie = api.raw(
  { expose: true, method: 'GET', path: '/login' },
  async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
    // get request parameters from url
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const email = url.searchParams.get('email');
    const password = url.searchParams.get('password');
    if (email && password) {
      // user authentication data founded
      // load user profile data
      const authenticationQry = () => orm<AuthenticationUser>('User');
      const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('email', email).where('disabled', false);
      const userAllowed = authentication && bcrypt.compareSync(password!, authentication.passwordHash);
      if (userAllowed) {
        // user allowed to access
        const userId: number = authentication.id;
        // unlock user status
        await userStatusUnlock(userId);
        // generate token
        const expiresIn: number = +jwtDurationInSeconds();
        const token: string = await new SignJWT({ userID: userId })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(expiresIn + 'minute')
          .sign(new TextEncoder().encode(jwtSercretKey()));
        // prepare response
        const responseData: LoginCookieResponse = {
          userId,
          expiresIn,
        };
        response.setHeader('Set-Cookie', `auth=${token};  HttpOnly; SameSite=None; Secure; Path=/;`);
        response.end(JSON.stringify(responseData));
      } else {
        // user not allowed to access
        throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_UNKNOWN_USER());
      }
    } else {
      // user authenticatio data not fouded
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED());
    }
  }
); // loginCookie

/**
 * Login renew for Bearer authentication.
 * Request for Bearer token renew before expiration.
 * Check current token validity and if valid generate and return a new token.
 * If wrong return a permission denied error.
 */
export const loginRenewBearer = api(
  { expose: true, auth: true, method: 'POST', path: '/login/renew' },
  async (request: LoginRenewBearerRequest): Promise<LoginBearerResponse> => {
    // get data from request
    // extract payload from token
    const { payload } = await jwtVerify<AuthenticationData>(request.token, new TextEncoder().encode(jwtSercretKey()));
    const userId: number = parseInt(payload.userID);
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
      const response: LoginBearerResponse = { token, expiresIn, userId };
      return response;
    } else {
      // token cannot be renewed
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_INVALID_TOKEN());
    }
  }
); // loginRenewBearer

/**
 * Login renew for Cookie authenticatiopn.
 * Request for Cookie token renew before expiration.
 * Check current token validity and if valid generate and return a new token.
 * If wrong return a permission denied error.
 */
export const loginRenewCookie = api.raw(
  { expose: true, auth: true, method: 'GET', path: '/login/renew' },
  async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
    // get request parameters from url
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const userIdRequest = url.searchParams.get('userId');
    if (userIdRequest) {
      // user authentication data founded
      // load user profile data
      const userAllowed = true;
      if (userAllowed) {
        // user allowed to access
        const userId: number = parseInt(userIdRequest);
        // generate token
        const expiresIn: number = +jwtDurationInSeconds();
        const token: string = await new SignJWT({ userID: userId })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(expiresIn + 'minute')
          .sign(new TextEncoder().encode(jwtSercretKey()));
        // prepare response
        const responseData: LoginCookieResponse = {
          userId,
          expiresIn,
        };
        response.setHeader('Set-Cookie', `auth=${token}; HttpOnly; SameSite=None; Secure; Path=/;`);
        response.end(JSON.stringify(responseData));
      } else {
        // user not allowed to access
        throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_UNKNOWN_USER());
      }
    } else {
      // user authenticatio data not fouded
      throw APIError.permissionDenied('User identificator required');
    }
  }
); // loginRenewCookie
