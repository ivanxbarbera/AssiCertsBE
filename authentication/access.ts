// libraries
import { api, APIError } from 'encore.dev/api';
import { jwtVerify, SignJWT } from 'jose';
import { orm } from '../common/db/db';
import bcrypt from 'bcryptjs';
// application modules
import {
  AuthenticationData,
  AuthenticationUser,
  LoginRenewBearerRequest,
  LoginRequest,
  LoginBearerResponse,
  LoginCookieResponse,
} from './authentication.model';
import { secret } from 'encore.dev/config';
import { IncomingMessage, ServerResponse } from 'http';

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
  const authenticationQry = () => orm<AuthenticationUser>('user');
  const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('email', request.email);
  const userAllowed = authentication && bcrypt.compareSync(request.password, authentication.passwordHash);
  if (userAllowed) {
    // user allowed to access
    const userId = authentication.id;
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
    throw APIError.permissionDenied('Unknown user');
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
      const authenticationQry = () => orm<AuthenticationUser>('user');
      const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('email', email);
      const userAllowed = authentication && bcrypt.compareSync(password!, authentication.passwordHash);
      if (userAllowed) {
        // user allowed to access
        const userId: number = authentication.id;
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
        throw APIError.permissionDenied('Unknown user');
      }
    } else {
      // user authenticatio data not fouded
      throw APIError.permissionDenied('Email and password required');
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
      throw APIError.permissionDenied('Invalid token');
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
  { expose: true, method: 'GET', path: '/login/renew' },
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
        throw APIError.permissionDenied('Unknown user');
      }
    } else {
      // user authenticatio data not fouded
      throw APIError.permissionDenied('User identificator required');
    }
  }
); // loginRenewCookie
