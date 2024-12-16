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
import { getUserPasswordExpiration, userStatusUnlock } from '../user/user';
import locz from '../common/i18n';
import { getAuthData } from '~encore/auth';
import { UserPasswordExpirationResponse } from '../user/user.model';
import { sendNotificationMessage } from '../notification/notification';
import { NotificationMessageType } from '../notification/notification.model';
import log from 'encore.dev/log';
import { authorizationOperationUserCheck } from '../authorization/authorization';
import { AuthorizationOperationResponse } from '../authorization/authorization.model';

const jwtSercretKey = secret('JWTSecretKey');
const jwtDurationInMinutes = secret('JWTDurationInMinute');

/**
 * User login with Bearer JWT.
 * Request for user authentication, using JWT in Bearer Header.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const loginBearer = api({ expose: true, method: 'POST', path: '/login' }, async (request: LoginRequest): Promise<LoginBearerResponse> => {
  // load user profile data
  const authenticationQry = () => orm<AuthenticationUser>('User');
  const authentication = await authenticationQry()
    .first('User.id as id', 'UserPasswordHistory.passwordHash as passwordHash')
    .join('UserPasswordHistory', 'User.id', '=', 'UserPasswordHistory.userId')
    .where('User.email', request.email)
    .where('User.disabled', false)
    .orderBy('UserPasswordHistory.date', 'desc');
  const userAllowed = authentication && bcrypt.compareSync(request.password, authentication.passwordHash);
  if (userAllowed) {
    // user allowed to access
    const userId = authentication.id;
    // check password expiration
    await checkUserPasswordExpiration(userId);
    // unlock user status
    await userStatusUnlock(userId);
    // generate token
    const expiresIn: number = +jwtDurationInMinutes();
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
    // try {
    // get request parameters from url
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const email = url.searchParams.get('email');
    const password = url.searchParams.get('password');
    if (email && password) {
      // user authentication data founded
      // load user profile data
      const authenticationQry = () => orm<AuthenticationUser>('User');
      const authentication = await authenticationQry()
        .first('User.id as id', 'UserPasswordHistory.passwordHash as passwordHash')
        .join('UserPasswordHistory', 'User.id', 'UserPasswordHistory.userId')
        .where('User.email', email)
        .where('User.disabled', false)
        .orderBy('UserPasswordHistory.date', 'desc');
      const userAllowed = authentication && bcrypt.compareSync(password!, authentication.passwordHash);
      if (userAllowed) {
        // user allowed to access
        const userId: number = authentication.id;
        // check password expiration
        await checkUserPasswordExpiration(userId);
        // unlock user status
        await userStatusUnlock(userId);
        // generate token
        const expiresIn: number = +jwtDurationInMinutes();
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
    // } catch (error) {
    //   log.debug(JSON.stringify(error));
    //   response.writeHead(500);
    //   response.end((error as Error).message);
    // }
  }
); //error loginCookie

/**
 * Check user password expiration.
 * If password expired throws an exception, if password near to expiration sends a notification to the user.
 * @param userId user identificator
 */
const checkUserPasswordExpiration = async (userId: number) => {
  // check password expiration
  const passwordEpiration: UserPasswordExpirationResponse = await getUserPasswordExpiration(userId);
  if (passwordEpiration.expired) {
    // user password expired
    throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_PASSWORD_EXPIRED());
  }
  // check password notification
  if (passwordEpiration.notificationRequired) {
    // check if notification has already been sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationCount = (
      await orm('NotificationMessage')
        .count('id')
        .where('userId', userId)
        .andWhere('type', NotificationMessageType.PasswordExpiration)
        .andWhere('timestamp', '>=', today)
    )[0]['count'] as number;
    if (notificationCount == 0) {
      // notification not sended today
      // send notification to user
      sendNotificationMessage({
        userId,
        message: locz().AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION({ expInDays: passwordEpiration.remainigDays }),
        type: NotificationMessageType.PasswordExpiration,
      });
    }
  }
}; // checkUserPasswordExpiration

/**
 * Login renew for Bearer authentication.
 * Request for Bearer token renew before expiration.
 * Check current token validity and if valid generate and return a new token.
 * If wrong return a permission denied error.
 */
export const loginRenewBearer = api(
  { expose: true, auth: true, method: 'POST', path: '/login/renew' },
  async (request: LoginRenewBearerRequest): Promise<LoginBearerResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'loginRenewBearer',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_USER_NOT_ALLOWED());
    }
    // get data from request
    // extract payload from token
    const { payload } = await jwtVerify<AuthenticationData>(request.token, new TextEncoder().encode(jwtSercretKey()));
    const tokenUserId: number = parseInt(payload.userID);
    if (tokenUserId !== request.userId) {
      // token cannot be renewed
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_INVALID_TOKEN());
    }
    // user allowed to access
    // generate new token
    const expiresIn: number = +jwtDurationInMinutes();
    const token: string = await new SignJWT({ userID: tokenUserId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn + 'minute')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    // prepare response
    const response: LoginBearerResponse = { token, expiresIn, userId: tokenUserId };
    return response;
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
    const userIdRequestParam = url.searchParams.get('userId');
    if (!userIdRequestParam) {
      // user authenticatio data not fouded
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_USER_ID_REQUIRED());
    }
    // user authentication data founded
    const userIdRequest: number = parseInt(userIdRequestParam);
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'loginRenewCookie',
      requestingUserId: userId,
      destinationUserIds: [userIdRequest],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().AUTHENTICATION_ACCESS_USER_NOT_ALLOWED());
    }
    // generate token
    const expiresIn: number = +jwtDurationInMinutes();
    const token: string = await new SignJWT({ userID: userIdRequest })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn + 'minute')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    // prepare response
    const responseData: LoginCookieResponse = {
      userId: userIdRequest,
      expiresIn,
    };
    response.setHeader('Set-Cookie', `auth=${token}; HttpOnly; SameSite=None; Secure; Path=/;`);
    response.end(JSON.stringify(responseData));
  }
); // loginRenewCookie
