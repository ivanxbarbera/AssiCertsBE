// libraries
import { api, APIError } from 'encore.dev/api';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getAuthData } from '~encore/auth';
import { createTransport, Transporter } from 'nodemailer';
import moment from 'moment';
// application modules
import { PasswordCheckParameters } from './../system/system.model';
import { secret } from 'encore.dev/config';
import { SMTPParameters } from './../system/system.model';
import { systemParametersPasswordCheck, systemParametersSmtp } from './../system/system';
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
  UserPasswordChangeRequest,
  UserPasswordCheckRequest,
  UserPasswordCheckResponse,
  UserPasswordHistoryCheckResponse,
  UserPasswordHistoryCheckRequest,
  UserPasswordHistory,
  UserPasswordExpirationRequest,
  UserPasswordExpirationResponse,
  UserStatusRequest,
  UserStatusResponse,
} from './user.model';
import { orm } from '../common/db/db';
import { Validators } from '../common/utility/validators.utility';
import { AuthenticationData } from '../authentication/authentication.model';
import { AuthenticationUser } from '../authentication/access.model';
import locz from '../common/i18n';

const jwtSercretKey = secret('JWTSecretKey');
const frontendBaseURL = secret('FrontendBaseURL');

/**
 * User registration.
 * Receive and check user data, verify email existance and add new user to system.
 * At the end send a confirmation email.
 */
export const userRegister = api({ expose: true, method: 'POST', path: '/user/register' }, async (request: UserRegisterRequest) => {
  // check data
  if (request.password !== request.passwordConfirm) {
    // password are different
    throw APIError.invalidArgument(locz().USER_USER_PASSWORD_MATCH());
  }
  // check password compliance
  const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
  if (!passwordCheck.compliant) {
    // password not compliant
    throw APIError.invalidArgument(locz().USER_USER_PASSWORD_NOT_COMPLIANT());
  }
  if (!Validators.isValidEmail(request.email)) {
    // email is not well formed
    throw APIError.invalidArgument(locz().USER_USER_EMAIL_MALFORMED());
  }
  // check for mail existance
  const emailCount = (await orm('User').count('id').where('email', request.email))[0]['id'] as number;
  if (emailCount > 0) {
    // email already exists
    throw APIError.alreadyExists(locz().USER_USER_EMAIL_ALREADY_EXIST());
  }
  // encrypt password
  const passwordHash = bcrypt.hashSync(request.password);
  // prepare user to be saved
  const newUser: User = {
    email: request.email,
    passwordHash: passwordHash,
    name: request.name,
    surname: request.surname,
    siteLocked: false,
    disabled: true,
  };
  // save new user
  const userRst = await orm('User').insert(newUser, ['id']);
  const id = userRst[0].id;
  // insert user password history
  const newUserPasswordHistory: UserPasswordHistory = {
    userId: id,
    date: new Date(),
    passwordHash,
  };
  const userPasswordHistoryQry = () => orm('UserPasswordHistory');
  const userPasswordHistoryRst = await userPasswordHistoryQry().insert(newUserPasswordHistory, ['id']);
  // send email to user
  const resetUrl = frontendBaseURL() + '/authentication';
  const smptParameters: SMTPParameters = await systemParametersSmtp();
  const smtpTransport: any = {
    host: smptParameters.host,
    port: smptParameters.port,
    secure: smptParameters.secure,
  };
  if (smptParameters.authentication) {
    smtpTransport.auth = {
      user: smptParameters.authenticationUsername,
      pass: smptParameters.authenticationPassowrd,
    };
  }
  const transporter: Transporter = createTransport(smtpTransport);
  await transporter.sendMail({
    from: smptParameters.defaultSender, // sender address
    to: newUser.email, // list of receivers
    subject: (smptParameters.subjectPrefix + ' ' + locz().USER_USER_PASSWORD_REGISTER_EMAIL_SUBJECT()).trim(),
    text: locz().USER_USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT({ name: newUser.name }),
    html: locz().USER_USER_PASSWORD_REGISTER_EMAIL_BODY_HTML({ name: newUser.name }),
  });
}); // userRegister

/**
 * Request for forgotten password reset.
 * Receive user email, generate a new token for password regeneration and send it via email to requesting user.
 */
export const userPasswordReset = api({ expose: true, method: 'GET', path: '/user/password-reset' }, async (request: UserPasswordResetRequest) => {
  // load user data
  const user = await orm<User>('User').first().where('email', request.email).where('disabled', false);
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
    await orm('UserPasswordReset').insert(userPasswordReset);
    // send email to user
    const resetUrl = frontendBaseURL() + '/authentication/reset-password;token=' + token;
    const smptParameters: SMTPParameters = await systemParametersSmtp();
    const smtpTransport: any = {
      host: smptParameters.host,
      port: smptParameters.port,
      secure: smptParameters.secure,
    };
    if (smptParameters.authentication) {
      smtpTransport.auth = {
        user: smptParameters.authenticationUsername,
        pass: smptParameters.authenticationPassowrd,
      };
    }
    const transporter: Transporter = createTransport(smtpTransport);
    await transporter.sendMail({
      from: smptParameters.defaultSender, // sender address
      to: user.email, // list of receivers
      subject: (smptParameters.subjectPrefix + ' ' + locz().USER_USER_PASSWORD_RESET_EMAIL_SUBJECT()).trim(),
      text: locz().USER_USER_PASSWORD_RESET_EMAIL_BODY_TEXT({ name: user.name, link: resetUrl }),
      html: locz().USER_USER_PASSWORD_RESET_EMAIL_BODY_HTML({ name: user.name, link: resetUrl }),
    });
  }
}); // userPasswordReset

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
      throw APIError.invalidArgument(locz().USER_USER_PASSWORD_MATCH());
    }
    // check password compliance
    const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
    if (!passwordCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USER_PASSWORD_NOT_COMPLIANT());
    }
    // load password reset data
    const userPasswordReset = await orm<UserPasswordReset>('UserPasswordReset').first().where('token', request.token);
    if (!userPasswordReset) {
      // request not fouded
      throw APIError.notFound(locz().USER_USER_RESET_REQ_NOT_FOUND());
    }
    if (Date.now() > userPasswordReset.expiresAt.getTime()) {
      // request expired
      throw APIError.resourceExhausted(locz().USER_USER_RESET_REQ_EXPIRED());
    }
    if (userPasswordReset.used) {
      // request already used
      throw APIError.permissionDenied(locz().USER_USER_RESET_REQ_USED());
    }
    // check password history
    const passwordHistoryCheck: UserPasswordHistoryCheckResponse = await userPasswordHistoryCheck({
      userId: userPasswordReset.userId,
      password: request.password,
    });
    if (!passwordHistoryCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USER_USED_PASSWORD());
    }
    // load user
    const user = await orm<User>('User').first().where('id', userPasswordReset.userId);
    if (!user) {
      // user not fouded
      throw APIError.notFound(locz().USER_USER_USER_NOT_FOUND());
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(request.password);
    // update user password
    await orm('User').where('id', user!.id).update('passwordHash', passwordHash);
    // insert user password history
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: user.id!,
      date: new Date(),
      passwordHash,
    };
    const userPasswordHistoryQry = () => orm('UserPasswordHistory');
    const userPasswordHistoryRst = await userPasswordHistoryQry().insert(newUserPasswordHistory, ['id']);
    // update password reset request
    await orm('UserPasswordReset').where('id', userPasswordReset.id).update('used', true);
    // send email to user
    const resetUrl = frontendBaseURL() + '/authentication';
    const smptParameters: SMTPParameters = await systemParametersSmtp();
    const smtpTransport: any = {
      host: smptParameters.host,
      port: smptParameters.port,
      secure: smptParameters.secure,
    };
    if (smptParameters.authentication) {
      smtpTransport.auth = {
        user: smptParameters.authenticationUsername,
        pass: smptParameters.authenticationPassowrd,
      };
    }
    const transporter: Transporter = createTransport(smtpTransport);
    await transporter.sendMail({
      from: smptParameters.defaultSender, // sender address
      to: user.email, // list of receivers
      subject: (smptParameters.subjectPrefix + ' ' + locz().USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT()).trim(),
      text: locz().USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT({ name: user.name, link: resetUrl }),
      html: locz().USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML({ name: user.name, link: resetUrl }),
    });
    // return response to caller
    const response: UserPasswordResetConfirmResponse = {
      email: user.email,
    };
    return response;
  }
); // userPasswordResetConfirm

/**
 * Password change.
 * Receive old and new password, check for old and new validity and change password.
 */
export const userPasswordChange = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/password-change' },
  async (request: UserPasswordChangeRequest) => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to change password
      throw APIError.permissionDenied(locz().USER_USER_USER_NOT_ALLOWED());
    }
    // check data
    if (request.password !== request.passwordConfirm) {
      // password are different
      throw APIError.invalidArgument(locz().USER_USER_PASSWORD_MATCH());
    }
    // check password compliance
    const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
    if (!passwordCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USER_PASSWORD_NOT_COMPLIANT());
    }
    // check password history
    const passwordHistoryCheck: UserPasswordHistoryCheckResponse = await userPasswordHistoryCheck({
      userId: request.userId,
      password: request.password,
    });
    if (!passwordHistoryCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USER_USED_PASSWORD());
    }
    // load user
    const user = await orm<User>('User').first().where('id', request.userId).where('disabled', false);
    if (!user) {
      // user not fouded
      throw APIError.notFound(locz().USER_USER_USER_NOT_FOUND());
    }
    // check current password
    if (!bcrypt.compareSync(request.password, user.passwordHash)) {
      // wrong previous password
      throw APIError.invalidArgument(locz().USER_USER_OLD_PASSWORD());
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(request.password);
    // update user password
    await orm('User').where('id', user!.id).update('passwordHash', passwordHash);
    // insert user password history
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: user.id!,
      date: new Date(),
      passwordHash,
    };
    // add new password to history
    const userPasswordHistoryQry = () => orm('UserPasswordHistory');
    const userPasswordHistoryRst = await userPasswordHistoryQry().insert(newUserPasswordHistory, ['id']);
  }
); // userPasswordChange

/**
 * User password history check.
 * Check if password is usable checking user passwords history .
 */
export const userPasswordHistoryCheck = api(
  { expose: true, auth: true, method: 'GET', path: '/user/password-history-check/:userId' },
  async (request: UserPasswordHistoryCheckRequest): Promise<UserPasswordHistoryCheckResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to change password
      throw APIError.permissionDenied(locz().USER_USER_USER_NOT_ALLOWED());
    }
    // load password constraints
    const passwordCheckParams: PasswordCheckParameters = await systemParametersPasswordCheck();
    // load user history password
    const userPasswordHistoriesQry = () => orm<UserPasswordHistory>('UserPasswordHistory');
    const userPasswordHistories: UserPasswordHistory[] = await userPasswordHistoriesQry()
      .select()
      .where('userId', request.userId)
      .orderBy('date', 'DESC')
      .limit(passwordCheckParams.historyUnusable);
    const findedPasswords = userPasswordHistories.filter((userPasswordHistory) => {
      return bcrypt.compareSync(request.password, userPasswordHistory.passwordHash);
    });
    if (findedPasswords.length > 0) {
      // password already used
      return { compliant: false };
    }
    // new password
    return { compliant: true };
  }
); // userPasswordHistoryCheck

/**
 * User password compliance check.
 * Check for password contraints compliance and evaluate password score and strngth.
 */
export const userPasswordCheck = api(
  { expose: true, method: 'GET', path: '/user/password-check' },
  async (request: UserPasswordCheckRequest): Promise<UserPasswordCheckResponse> => {
    // load password constraints
    const passwordCheckParams: PasswordCheckParameters = await systemParametersPasswordCheck();
    // check password compliance
    const password = request.password;
    let score = 0;
    let compliant = true;
    // minimum compliance requirements
    const length = password.length;
    const hasMinLength = length > passwordCheckParams.minLength;
    const lowerCaseNum = (password.match(/[a-z]/g) || []).length;
    const hasLowerCase = lowerCaseNum >= passwordCheckParams.minLowerLetters;
    const upperCaseNum = (password.match(/[A-Z]/g) || []).length;
    const hasUpperCase = upperCaseNum >= passwordCheckParams.minUpperLetters;
    const numberNum = (password.match(/\d/g) || []).length;
    const hasNumber = numberNum >= passwordCheckParams.minNumbers;
    const specialsNum = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    const hasSpecialChar = specialsNum >= passwordCheckParams.minSpecials;
    // check password compliance
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      compliant = false;
    }
    // calculate base score for compliance
    if (password != '') score += 1;
    if (hasMinLength) score += 1;
    if (hasLowerCase) score += 1;
    if (hasUpperCase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;
    // more than minimal requirements
    if (length > passwordCheckParams.minLength + 2) score += 2;
    if (lowerCaseNum > passwordCheckParams.minLowerLetters + 2) score += 2;
    if (upperCaseNum > passwordCheckParams.minUpperLetters + 2) score += 2;
    if (numberNum > passwordCheckParams.minNumbers + 2) score += 2;
    if (specialsNum > passwordCheckParams.minSpecials + 2) score += 2;
    // password length
    if (password.length >= passwordCheckParams.minLength + 4) score += 2;
    // characters variety
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 2;
    // penalty for consecutive repeating characters
    const repeatingChars = /(.)\1/.test(password);
    if (repeatingChars) score -= 1;
    // penalty for predictable patterns (like sequential numbers or letters)
    const hasSequentialPattern =
      /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
        password
      );
    if (hasSequentialPattern) score -= 2;
    // set strength based in score
    let strength = 'NON_COMPLIANT';
    if (compliant) {
      if (score <= 10) {
        strength = 'WEAK';
      } else if (score <= 15) {
        strength = 'MEDIUM';
      } else {
        strength = 'STRONG';
      }
    }
    // prepare response
    const response: UserPasswordCheckResponse = {
      score: Math.round((100 * score) / 20),
      strength,
      compliant,
      hasMinLength,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    };
    return response;
  }
); // userPasswordCheck

/**
 * User site lock.
 * Receive lock site request for user, check permissions and mark as locked.
 */
export const userSiteLock = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/lock-site' },
  async (request: UserSiteLockRequest): Promise<UserStatusResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().USER_USER_USER_NOT_ALLOWED());
    }
    // update user lock status
    await orm('User').where('id', request.id).update('siteLocked', true);
    // return user profile
    return await userStatusGet({
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
  async (request: UserSiteUnlockRequest): Promise<UserStatusResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().USER_USER_USER_NOT_ALLOWED());
    }
    // load user profile data
    const authenticationQry = () => orm<AuthenticationUser>('User');
    const authentication = await authenticationQry().first('id', 'email', 'passwordHash').where('id', request.id);
    const userAllowed = authentication && bcrypt.compareSync(request.password, authentication.passwordHash);
    if (!userAllowed) {
      // user not allowed to unlock site
      throw APIError.permissionDenied('Unknown user');
    }
    // update user lock status
    await userStatusUnlock(userId);
    // return user profile
    return await userStatusGet({
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
  await orm('User').where('id', id).update('siteLocked', false);
}; // userStatusUnlock

/**
 * Search for users.
 * Apply filters and return a list of users.
 */
export const userList = api({ expose: true, auth: true, method: 'GET', path: '/user' }, async (): Promise<UserListResponse> => {
  // TODO add search filters
  // load users
  const usersQry = () => orm<UserList>('User');
  const users = await usersQry().select('id', 'email', 'name', 'surname', 'disabled').orderBy('surname').orderBy('name');
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
    const userQry = () => orm<UserResponse>('User');
    const user = await userQry().first().where('id', request.id);
    if (!user) {
      // user not found
      throw APIError.notFound(locz().USER_USER_USER_NOT_FOUND());
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
  { expose: true, auth: true, method: 'POST', path: '/user' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    // check for mail existance
    const emailCount = (await orm('User').count('id').where('email', request.email))[0]['id'] as number;
    if (emailCount > 0) {
      // email already exists
      throw APIError.alreadyExists(locz().USER_USER_EMAIL_ALREADY_EXIST());
    }
    // add internal fields
    const password = await generateRandomPassword();
    const passwordHash = bcrypt.hashSync(password);
    const newUser: User = {
      ...request,
      passwordHash,
      siteLocked: false,
    };
    // insert user
    const userQry = () => orm('User');
    const userRst = await userQry().insert(newUser, ['id']);
    const id = userRst[0].id;
    // insert user password history
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: id,
      date: new Date(),
      passwordHash,
    };
    const userPasswordHistoryQry = () => orm('UserPasswordHistory');
    const userPasswordHistoryRst = await userPasswordHistoryQry().insert(newUserPasswordHistory, ['id']);
    // request for password regeneration
    userPasswordReset({ email: request.email });
    // return created user
    return userDetails({ id });
  }
); // userInsert

/**
 * Update existing user.
 */
export const userUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/:id' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    // load user
    const userQry = () => orm<UserResponse>('User');
    const user = await userQry().first().where('id', request.id);
    if (!user) {
      // user not found
      throw APIError.notFound(locz().USER_USER_USER_NOT_FOUND());
    }
    if (user.email !== request.email) {
      // user changed his email
      // check for mail existance
      const emailCount = (await orm('User').count('id').where('email', request.email))[0]['id'] as number;
      if (emailCount > 0) {
        // email already exists
        throw APIError.alreadyExists(locz().USER_USER_EMAIL_ALREADY_EXIST());
      }
    }
    // update user
    const userUpdateQry = () => orm('User');
    const resutlQry = await userUpdateQry().where('id', request.id).update(request, ['id']);
    // return updated user
    return userDetails({ id: resutlQry[0].id });
  }
); // userUpdate

/**
 * Genarate a random password.
 * @returns generated password
 */
const generateRandomPassword = async () => {
  // load passowrd constraints
  const passwordCheckParams: PasswordCheckParameters = await systemParametersPasswordCheck();
  // password type data
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  const allChars = uppercase + lowercase + numbers + specialChars;
  // generate password
  let password = '';
  // add characters from each category
  for (let i = 0; i < passwordCheckParams.minLowerLetters + 1; i++) {
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  }
  for (let i = 0; i < passwordCheckParams.minUpperLetters + 1; i++) {
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  }
  for (let i = 0; i < passwordCheckParams.minNumbers + 1; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  for (let i = 0; i < passwordCheckParams.minSpecials; i++) {
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  // complete the password
  for (let i = password.length; i < passwordCheckParams.minLength + 4; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  // shuffle password to ensure random order
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
  return password;
}; // generateRandomPassword

/**
 * User password hostory check.
 * Check if password is usable checking user passwords history .
 */
export const userPasswordExpirationCheck = api(
  { expose: true, auth: true, method: 'GET', path: '/user/password-expiration-check/:userId' },
  async (request: UserPasswordExpirationRequest): Promise<UserPasswordExpirationResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to change password
      throw APIError.permissionDenied(locz().USER_USER_USER_NOT_ALLOWED());
    }
    // get password expiration data
    return getUserPasswordExpiration(request.userId);
  }
); // userPasswordExpirationCheck

/**
 * Get data about user password expiration.
 * @param userId user unique identificator
 * @returns user password expiration data
 */
export const getUserPasswordExpiration = async (userId: number): Promise<UserPasswordExpirationResponse> => {
  // load last user history password
  const userPasswordHistoryQry = () => orm<UserPasswordHistory>('UserPasswordHistory');
  const userPasswordHistory = await userPasswordHistoryQry().first().where('userId', userId).orderBy('date', 'DESC');
  if (!userPasswordHistory) {
    // last password history not found
    throw APIError.notFound(locz().USER_USER_PASSWORD_HISTORY_NOT_FOUND());
  }
  // calculate the difference in days
  const daysFromLastChange = moment().diff(moment(userPasswordHistory.date), 'days');
  // load password constraints
  const passwordCheckParams: PasswordCheckParameters = await systemParametersPasswordCheck();
  // estimate remaninig days
  const remainigDays = passwordCheckParams.expirationDays - daysFromLastChange;
  // prepare response
  const response: UserPasswordExpirationResponse = {
    remainigDays,
    expired: remainigDays <= 0,
    notificationRequired: remainigDays < passwordCheckParams.expirationNotificationDays,
  };
  return response;
}; // getUserPasswordExpiration

/**
 * User status information.
 * Returns user status information, a subset of user details.
 */
export const userStatusGet = api(
  { expose: true, auth: true, method: 'GET', path: '/user/status/:id' },
  async (request: UserStatusRequest): Promise<UserStatusResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().USER_USER_STATUS_USER_NOT_ALLOWED());
    }
    // return user profile data
    const userStatusQry = () => orm<UserStatusResponse>('User');
    const userStatus = await userStatusQry().first('name', 'surname', 'siteLocked').where('id', request.id);
    if (!userStatus) {
      // user not founded
      throw APIError.notFound(locz().USER_USER_STATUS_USER_NOT_FOUND());
    }
    return userStatus;
  }
); // userStatusGet
