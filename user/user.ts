// libraries
import { api, APIError } from 'encore.dev/api';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getAuthData } from '~encore/auth';
// application modules
import { secret } from 'encore.dev/config';
import {
  UserPasswordResetRequest,
  UserPasswordReset,
  UserPasswordResetConfirmRequest,
  User,
  UserRegisterRequest,
  UserPasswordResetConfirmResponse,
  UserSiteLockRequest,
  UserSiteUnlockRequest,
  UserList,
  UserListResponse,
  UserRequest,
  UserResponse,
  UserEditRequest,
} from './user.model';
import { orm } from '../common/db/db';
import { Validators } from '../common/utility/validators.utility';
import { AuthenticationData } from '../authentication/authentication.model';
import { userProfileGet } from './profile/profile';
import { UserProfileResponse } from './profile/profile.model';
import { AuthenticationUser } from '../authentication/access.model';

const jwtSercretKey = secret('JWTSecretKey');

/**
 * User registration.
 * Receive and check user data, verify email existance and add new user to system.
 */
export const userRegister = api({ expose: true, method: 'POST', path: '/user/register' }, async (request: UserRegisterRequest) => {
  // check data
  if (request.password !== request.passwordConfirm) {
    // password are different
    throw APIError.invalidArgument('Password and confirm password must be the same');
  }
  if (!Validators.isValidEmail(request.email)) {
    // email is not well formed
    throw APIError.invalidArgument('Email address is not well formed');
  }
  // check for mail existance
  const emailCount = (await orm('user').count('id').where('email', request.email))[0]['id'] as number;
  if (emailCount > 0) {
    // email already exists
    throw APIError.alreadyExists('User with specified email already exists');
  }
  // prepare user to be saved
  const newUser: User = {
    email: request.email,
    passwordHash: bcrypt.hashSync(request.password),
    name: request.name,
    surname: request.surname,
    siteLocked: false,
  };
  // save new user
  await orm('user').insert(newUser);
  // send email to user
  // TODO send email to user
}); // userRegister

/**
 * Request for forgotten password reset.
 * Receive user email, generate a new token for password regeneration and send it via email to requesting user.
 */
export const userPasswordReset = api(
  { expose: true, method: 'GET', path: '/user/password-reset/:email' },
  async (request: UserPasswordResetRequest) => {
    // load user data
    const user = await orm.first().where('email', request.email).from<User>('user');
    if (user) {
      // prepare password reset
      // generate new token
      const token: string = await new SignJWT({ email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('60minute')
        .sign(new TextEncoder().encode(jwtSercretKey()));
      const userPasswordReset: UserPasswordReset = {
        userId: user.id!,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        used: false,
      };
      // save password reset request
      await orm('user_password_reset').insert(userPasswordReset);
      // send email to user
      // TODO send email to user
    }
  }
); // userPasswordReset

/**
 * Password reset.
 * Receive new password and validation token, check consistency and update user data.
 * Invalidate password regeneration request and send confirmation email to user.
 */
export const userPasswordResetConfirm = api(
  { expose: true, method: 'PATCH', path: '/user/password-reset' },
  async (request: UserPasswordResetConfirmRequest): Promise<UserPasswordResetConfirmResponse> => {
    // check data
    if (request.password !== request.passwordConfirm) {
      // password are different
      throw APIError.invalidArgument('Password and confirm password must be the same');
    }
    // load password reset data
    const userPasswordReset = await orm<UserPasswordReset>('user_password_reset').first().where('token', request.token);
    if (!userPasswordReset) {
      // request not fouded
      throw APIError.notFound('Password reset request not fouded');
    }
    if (Date.now() > userPasswordReset.expiresAt.getTime()) {
      // request expired
      throw APIError.resourceExhausted('Password reset request expired');
    }
    if (userPasswordReset.used) {
      // request already used
      throw APIError.permissionDenied('Password reset request already used');
    }
    // load user
    const user = await orm<User>('user').first().where('id', userPasswordReset.userId);
    if (!user) {
      // user not fouded
      throw APIError.notFound('User not founded');
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(request.password);
    // update user password
    await orm('user').where('id', user!.id).update('passwordHash', passwordHash);
    // update password reset request
    await orm('user_password_reset').where('id', userPasswordReset.id).update('used', true);
    // send email to user
    // TODO send email to user
    // return response to caller
    const response: UserPasswordResetConfirmResponse = {
      email: user.email,
    };
    return response;
  }
); // userPasswordResetConfirm

/**
 * User site lock.
 * Receive lock site request for user, check permissions and mark as locked.
 */
export const userSiteLock = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/lock-site' },
  async (request: UserSiteLockRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied('User not allowed to access requested data');
    }
    // update user lock status
    await orm('user').where('id', request.id).update('siteLocked', true);
    // return user profile
    return await userProfileGet({
      id: request.id,
    });
  }
); // userSiteLock

/**
 * User site unlock.
 * Receive unlock site request for user, check permissions and mark as unlocked.
 */
export const userSiteUnlock = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/unlock-site' },
  async (request: UserSiteUnlockRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied('User not allowed to access requested data');
    }
    // load user profile data
    const authenticationQry = () => orm<AuthenticationUser>('user');
    const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('id', request.id);
    const userAllowed = authentication && bcrypt.compareSync(request.password, authentication.passwordHash);
    if (!userAllowed) {
      // user not allowed to unlock site
      throw APIError.permissionDenied('Unknown user');
    }
    // update user lock status
    await userStatusUnlock(userId);
    // return user profile
    return await userProfileGet({
      id: request.id,
    });
  }
); // userSiteUnlock

/**
 * Change user status to unlocked.
 * @param id identifier of the user to be unlocked
 */
export const userStatusUnlock = async (id: number) => {
  // update user lock status
  await orm('user').where('id', id).update('siteLocked', false);
}; // userStatusUnlock

/**
 * Search for users.
 * Apply filters and return a list of users.
 */
export const userList = api({ expose: true, auth: true, method: 'GET', path: '/user' }, async (): Promise<UserListResponse> => {
  // TODO add search filters
  // load users
  const usersQry = () => orm<UserList>('user');
  const users = await usersQry().select('id', 'email', 'name', 'surname');
  // return users
  return {
    users,
  };
}); // userList

/**
 * Load user details.
 */
export const userDetails = api(
  { expose: true, auth: true, method: 'GET', path: '/user/:id' },
  async (request: UserRequest): Promise<UserResponse> => {
    // load user
    const userQry = () => orm<UserResponse>('user');
    const user = await userQry().first().where('id', request.id);
    if (!user) {
      // user not found
      throw APIError.notFound('Requested user not found');
    }
    // remove internal fields
    ['passwordHash'].forEach((field: string) => {
      if (field in user) {
        delete (user as any)[field];
      }
    });
    // return user
    return user;
  }
); // userDetails

/**
 * Insert new user.
 */
export const userInsert = api(
  { expose: true, auth: false, method: 'POST', path: '/user' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    // TODO check for existent user by email
    // TODO check data
    // add internal fields
    const password = generateRandomPassword();
    const newUser: User = {
      ...request,
      passwordHash: bcrypt.hashSync(password),
      siteLocked: false,
    };
    // insert user
    const userQry = () => orm('user');
    const resutlQry = await userQry().insert(newUser, ['id']);
    // request for password regeneration
    userPasswordReset({ email: request.email });
    // return created user
    return userDetails({ id: resutlQry[0].id });
  }
); // userInsert

/**
 * Update existing user.
 */
export const userUpdate = api(
  { expose: true, auth: false, method: 'PATCH', path: '/user/:id' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    // TODO check that user exists by id
    // TODO check data
    // update user
    const userQry = () => orm('user');
    const resutlQry = await userQry().where('id', request.id).update(request, ['id']);
    // return updated user
    return userDetails({ id: resutlQry[0].id });
  }
); // userUpdate

/**
 * Genarate a random password.
 * @returns generated password
 */
const generateRandomPassword = () => {
  // password type data
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  const allChars = uppercase + lowercase + numbers + specialChars;
  // generate password
  let password = '';
  // at least one character from each category is included
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  // complete the password
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  // shuffle password to ensure random order
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
  return password;
}; // generateRandomPassword
