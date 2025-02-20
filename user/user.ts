// libraries
import { api, APIError } from 'encore.dev/api';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getAuthData } from '~encore/auth';
import moment from 'moment';
import { secret } from 'encore.dev/config';
// application modules
import { UserCheckParameters } from './../system/system.model';
import { PasswordCheckParameters } from './../system/system.model';
import { systemParametersPasswordCheck, systemParametersUserCheck } from './../system/system';
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
  UserRole,
  UserEmail,
  UserDealer,
} from './user.model';
import { orm } from '../common/db/db';
import { ValidatorsUtility } from '../common/utility/validators.utility';
import { AuthenticationData } from '../authentication/authentication.model';
import { AuthenticationUser } from '../authentication/access.model';
import locz from '../common/i18n';
import { authorizationDestinationUserCheck, authorizationOperationUserCheck } from '../authorization/authorization';
import { AuthorizationDestinationUserCheckResponse, AuthorizationOperationResponse } from '../authorization/authorization.model';
import { sendNotificationMessage } from '../notification/notification';
import { NotificationMessageType } from '../notification/notification.model';
import { DbUtility } from '../common/utility/db.utility';
import { GeneralUtility } from '../common/utility/general.utility';
import { Email, EmailType, EmailListResponse, EmailEditRequest, AddressListResponse } from './address/address.model';
import { emailUserCheck, emailListByUser, emailUserUpdate, addressListByUser, addressUserUpdate } from './address/address';
import { DealerListResponse } from '../dealer/dealer.model';
import { dealerDetail, dealerList } from '../dealer/dealer';

const jwtSercretKey = secret('JWTSecretKey');
const frontendBaseURL = secret('FrontendBaseURL');
const frontendBaseName = secret('FrontendBaseName');

/**
 * User registration.
 * Receive and check user data, verify email existance and add new user to system.
 * At the end send a confirmation email.
 */
export const userRegister = api({ expose: true, method: 'POST', path: '/user/register' }, async (request: UserRegisterRequest) => {
  // check data
  if (request.password !== request.passwordConfirm) {
    // password are different
    throw APIError.invalidArgument(locz().USER_PASSWORD_MATCH());
  }
  // check password compliance
  const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
  if (!passwordCheck.compliant) {
    // password not compliant
    throw APIError.invalidArgument(locz().USER_PASSWORD_NOT_COMPLIANT());
  }
  // load email type
  // TODO MIC add flag default to EmailType for getting default new user type
  const emailType = await orm<EmailType>('EmailType').first().where('code', 'PER');
  // check email
  const newEmail: EmailEditRequest = {
    email: request.email,
    typeId: emailType!.id,
    default: true,
    authentication: true,
  };
  let { defaultEmail } = await emailUserCheck({ emails: [newEmail] });
  // encrypt password
  const passwordHash = bcrypt.hashSync(request.password);
  // prepare user to be saved
  const newUser: User = {
    role: UserRole.Member,
    name: request.name,
    surname: request.surname,
    fiscalCode: '',
    language: '',
    siteLocked: false,
    disabled: true,
  };
  // save new user
  const userRst = await orm('User').insert(newUser).returning('id');
  const id = userRst[0].id;
  // insert user email
  await emailUserUpdate({ entityId: id, emails: [newEmail] });
  // insert user password history
  const newUserPasswordHistory: UserPasswordHistory = {
    userId: id,
    date: new Date(),
    passwordHash,
  };
  const userPasswordHistoryRst = await orm('UserPasswordHistory').insert(newUserPasswordHistory, ['id']);
  // send email to user
  await GeneralUtility.emailSend({
    recipients: defaultEmail,
    subject: locz().USER_PASSWORD_REGISTER_EMAIL_SUBJECT(),
    bodyHtml: locz().USER_PASSWORD_REGISTER_EMAIL_BODY_HTML({ name: newUser.name }),
    bodyText: locz().USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT({ name: newUser.name }),
  })
    .then(async () => {
      // send notify to admin users for confirmation
      // get authorized users
      const destinationUserCheck: AuthorizationDestinationUserCheckResponse = await authorizationDestinationUserCheck({
        operationCode: 'userRegisterActivate',
      });
      // send notification to users
      destinationUserCheck.userIds.forEach((userId) => {
        sendNotificationMessage({
          userId,
          type: NotificationMessageType.UserMaintenance,
          message: locz().USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE({ name: newUser.name, surname: newUser.surname }),
          detail: locz().USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE_DETAIL(),
          entityId: id,
        });
      });
    })
    .catch((error) => {
      // error sending email
      throw APIError.unavailable(locz().EMAIL_SEND_ERROR());
    });
}); // userRegister

/**
 * Request for forgotten password reset.
 * Receive user email, generate a new token for password regeneration and send it via email to requesting user.
 */
export const userPasswordReset = api({ expose: true, method: 'GET', path: '/user/password-reset' }, async (request: UserPasswordResetRequest) => {
  // load user email data
  const user = await orm<{ id: string; name: string; email: string }>('User')
    .first('User.id as id', 'User.name as name', 'Email.email as email')
    .join('UserEmail', 'UserEmail.userId', 'User.id')
    .join('Email', 'Email.id', 'UserEmail.emailId')
    .where('Email.email', request.email)
    .where('UserEmail.authentication', true)
    .where('User.disabled', false);
  if (user) {
    // prepare password reset
    // generate new token
    const token: string = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('60minute')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    const userPasswordReset: UserPasswordReset = {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      used: false,
    };
    // save password reset request
    await orm('UserPasswordReset').insert(userPasswordReset);
    // send email to user
    const resetUrl = frontendBaseURL() + '/authentication/reset-password;token=' + token;
    await GeneralUtility.emailSend({
      recipients: user.email,
      subject: locz().USER_PASSWORD_RESET_EMAIL_SUBJECT(),
      bodyHtml: locz().USER_PASSWORD_RESET_EMAIL_BODY_HTML({ name: user.name, link: resetUrl }),
      bodyText: locz().USER_PASSWORD_RESET_EMAIL_BODY_TEXT({ name: user.name, link: resetUrl }),
    })
      .then(() => {})
      .catch((error) => {
        // error sending email
        throw APIError.unavailable(locz().EMAIL_SEND_ERROR());
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
      throw APIError.invalidArgument(locz().USER_PASSWORD_MATCH());
    }
    // check password compliance
    const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
    if (!passwordCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_PASSWORD_NOT_COMPLIANT());
    }
    // load password reset data
    const userPasswordReset = await orm<UserPasswordReset>('UserPasswordReset').first().where('token', request.token);
    if (!userPasswordReset) {
      // request not fouded
      throw APIError.notFound(locz().USER_RESET_REQ_NOT_FOUND());
    }
    if (Date.now() > userPasswordReset.expiresAt.getTime()) {
      // request expired
      throw APIError.resourceExhausted(locz().USER_RESET_REQ_EXPIRED());
    }
    if (userPasswordReset.used) {
      // request already used
      throw APIError.permissionDenied(locz().USER_RESET_REQ_USED());
    }
    // check password history
    const passwordHistoryCheck: UserPasswordHistoryCheckResponse = await isUserPasswordHistoryAlreadyUsed({
      userId: userPasswordReset.userId,
      password: request.password,
    });
    if (!passwordHistoryCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USED_PASSWORD());
    }
    // load user
    const user = await orm<{ id: string; name: string; email: string }>('User')
      .first('User.id as id', 'User.name as name', 'Email.email as email')
      .join('UserEmail', 'UserEmail.userId', 'User.id')
      .join('Email', 'Email.id', 'UserEmail.emailId')
      .where('User.id', userPasswordReset.userId)
      .where('UserEmail.authentication', true);
    if (!user) {
      // user not fouded
      throw APIError.notFound(locz().USER_USER_NOT_FOUND());
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(request.password);
    // insert user password history
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: user.id,
      date: new Date(),
      passwordHash,
    };
    const userPasswordHistoryRst = await orm('UserPasswordHistory').insert(newUserPasswordHistory, ['id']);
    // update password reset request
    await orm('UserPasswordReset').where('id', userPasswordReset.id).update('used', true);
    // send email to user
    const resetUrl = frontendBaseURL() + '/authentication';
    return await GeneralUtility.emailSend({
      recipients: user.email,
      subject: locz().USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT(),
      bodyHtml: locz().USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML({ name: user.name, link: resetUrl }),
      bodyText: locz().USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT({ name: user.name, link: resetUrl }),
    })
      .then(() => {
        // return response to caller
        const response: UserPasswordResetConfirmResponse = {
          email: user.email,
        };
        return response;
      })
      .catch((error) => {
        // error sending email
        throw APIError.unavailable(locz().EMAIL_SEND_ERROR());
      });
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userPasswordChange',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to change password
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // check data
    if (request.password !== request.passwordConfirm) {
      // password are different
      throw APIError.invalidArgument(locz().USER_PASSWORD_MATCH());
    }
    // check password compliance
    const passwordCheck: UserPasswordCheckResponse = await userPasswordCheck({ password: request.password });
    if (!passwordCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_PASSWORD_NOT_COMPLIANT());
    }
    // check password history
    const passwordHistoryCheck: UserPasswordHistoryCheckResponse = await userPasswordHistoryCheck({
      userId: request.userId,
      password: request.password,
    });
    if (!passwordHistoryCheck.compliant) {
      // password not compliant
      throw APIError.invalidArgument(locz().USER_USED_PASSWORD());
    }
    // load user
    const user = await orm<User>('User')
      .first('User.id as id', 'UserPasswordHistory.passwordHash as passwordHash')
      .join('UserPasswordHistory', 'User.id', 'UserPasswordHistory.userId')
      .where('User.id', request.userId)
      .where('User.disabled', false);
    if (!user) {
      // user not fouded
      throw APIError.notFound(locz().USER_USER_NOT_FOUND());
    }
    // check current password
    if (!bcrypt.compareSync(request.oldPassword, user.passwordHash)) {
      // wrong previous password
      throw APIError.invalidArgument(locz().USER_OLD_PASSWORD());
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(request.password);
    // insert user password history
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: user.id!,
      date: new Date(),
      passwordHash,
    };
    // add new password to history
    const userPasswordHistoryRst = await orm('UserPasswordHistory').insert(newUserPasswordHistory, ['id']);
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userPasswordHistoryCheck',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to change password
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // check if password already used
    return await isUserPasswordHistoryAlreadyUsed(request);
  }
); // userPasswordHistoryCheck

/**
 * Check if user password is already used in past.
 * @param request user password check request
 * @returns user password check response
 */
const isUserPasswordHistoryAlreadyUsed = async (request: UserPasswordHistoryCheckRequest): Promise<UserPasswordHistoryCheckResponse> => {
  // load password constraints
  const passwordCheckParams: PasswordCheckParameters = await systemParametersPasswordCheck();
  // load user history password
  const userPasswordHistories: UserPasswordHistory[] = await orm<UserPasswordHistory>('UserPasswordHistory')
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
}; // isUserPasswordHistoryAlreadyUsed

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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userSiteLock',
      requestingUserId: userId,
      destinationUserIds: [request.id],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to lock
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userSiteUnlock',
      requestingUserId: userId,
      destinationUserIds: [request.id],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to unlock
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load user profile data
    const authentication = await orm<AuthenticationUser>('User')
      .first('User.id as id', 'UserPasswordHistory.passwordHash as passwordHash')
      .join('UserPasswordHistory', 'User.id', 'UserPasswordHistory.userId')
      .where('User.id', request.id);
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
  // get authentication data
  const authenticationData: AuthenticationData = getAuthData()!;
  // load users
  const usersQry = orm<UserList>('User')
    .join('UserEmail', 'UserEmail.userId', 'User.id')
    .join('Email', 'Email.id', 'UserEmail.emailId')
    .leftOuterJoin('UserDealer', 'UserDealer.userId', 'User.id')
    .leftOuterJoin('Dealer', 'Dealer.id', 'UserDealer.dealerId')
    .where('UserEmail.authentication', true);
  if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
    usersQry.join('UserDealer', 'UserDealer.userId', 'User.id').where('UserDealer.dealerId', authenticationData.dealerId);
  }
  const users = await usersQry
    .select(
      'User.id as id',
      'User.role as role',
      'Email.email as email',
      'User.name as name',
      'User.surname as surname',
      'User.disabled as disabled',
      'Dealer.companyName as dealerCompanyName'
    )
    .orderBy('User.surname')
    .orderBy('User.name');
  // check authorization
  const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
    operationCode: 'userList',
    requestingUserRole: getAuthData()?.userRole,
    destinationUserRoles: users.map((user) => {
      const role: UserRole = user.role;
      return role;
    }),
  });
  if (!authorizationCheck.canBePerformed) {
    // user not allowed to get details
    throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
  }
  // return users
  return {
    users: DbUtility.removeNullFieldsList(users),
  };
}); // userList

/**
 * Load user details.
 */
export const userDetail = api({ expose: true, auth: true, method: 'GET', path: '/user/:id' }, async (request: UserRequest): Promise<UserResponse> => {
  // get authentication data
  const authenticationData: AuthenticationData = getAuthData()!;
  const userId = parseInt(authenticationData.userID);
  // load user
  const userQry = orm<UserResponse>('User').where('id', request.id);
  if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
    userQry.join('UserDealer', 'UserDealer.userId', 'User.id').where('UserDealer.dealerId', authenticationData.dealerId);
  }
  const user = await userQry.first();
  if (!user) {
    // user not found
    throw APIError.notFound(locz().USER_USER_NOT_FOUND());
  }
  // check authorization
  const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
    operationCode: 'userDetail',
    requestingUserId: userId,
    destinationUserIds: [user.id!],
    requestingUserRole: authenticationData.userRole,
    destinationUserRoles: [user.role],
  });
  if (!authorizationCheck.canBePerformed) {
    // user not allowed to get details
    throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
  }
  // load dealer
  const dealerListResponse: DealerListResponse = await dealerList({ userId: user.id });
  if (dealerListResponse.dealers.length > 0) {
    user.dealer = await dealerDetail({ id: dealerListResponse.dealers[0].id });
  }
  // load user emails
  const emailList: EmailListResponse = await emailListByUser({ entityId: user.id });
  user.emails = emailList.emails;
  // load user addresses
  const addressList: AddressListResponse = await addressListByUser({ entityId: user.id });
  user.addresses = addressList.addresses;
  // return user
  return DbUtility.removeNullFields(user);
}); // userDetail

/**
 * Insert new user.
 */
export const userInsert = api(
  { expose: true, auth: true, method: 'POST', path: '/user' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    if (request.id) {
      // entity id not allowed in insert mode
      // TODO MIC extends to other insert
      throw APIError.permissionDenied(locz().COMMON_ID_NOT_ALLOWED_INSERT());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userInsert',
      requestingUserRole: getAuthData()?.userRole,
      destinationUserRoles: [request.role],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // check email
    const userEmails = request.emails;
    let { defaultEmail } = await emailUserCheck({ emails: userEmails });
    // add internal fields
    // TODO MIC evaluate using filterObjectByInterface
    const newUser: User = {
      ...request,
      siteLocked: false,
    };
    // remove unnecessary fields
    delete (newUser as any)['addresses'];
    delete (newUser as any)['emails'];
    delete (newUser as any)['dealerId'];
    // insert user
    const userRst = await orm('User').insert(newUser).returning('id');
    const id = userRst[0].id;
    // insert dealer
    if (request.dealerId) {
      // associate dealer to user
      const newUserDealer: UserDealer = {
        userId: id,
        dealerId: request.dealerId,
      };
      await orm('UserDealer').insert(newUserDealer);
    }
    // insert emails
    await emailUserUpdate({ entityId: id, emails: userEmails });
    // insert addresses
    const userAddresses = request.addresses;
    await addressUserUpdate({ entityId: id, addresses: userAddresses });
    // insert user password history
    const password = await generateRandomPassword();
    const passwordHash = bcrypt.hashSync(password);
    const newUserPasswordHistory: UserPasswordHistory = {
      userId: id,
      date: new Date(),
      passwordHash,
    };
    const userPasswordHistoryRst = await orm('UserPasswordHistory').insert(newUserPasswordHistory, ['id']);
    // request for password regeneration
    userPasswordReset({ email: defaultEmail });
    // return created user
    return userDetail({ id });
  }
); // userInsert

/**
 * Update existing user.
 */
export const userUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/:id' },
  async (request: UserEditRequest): Promise<UserResponse> => {
    if (!request.id) {
      // entity id required in edit mode
      // TODO MIC extends to other edit
      throw APIError.permissionDenied(locz().COMMON_ID_REQUIRED_UPDATE());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userUpdate',
      requestingUserRole: authenticationData.userRole,
      destinationUserRoles: [request.role],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load user
    const userQry = orm<User>('User').where('User.id', request.id);
    if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
      userQry.join('UserDealer', 'UserDealer.userId', 'User.id').where('UserDealer.dealerId', authenticationData.dealerId);
    }
    const user = await userQry.first();
    if (!user) {
      // user not found
      throw APIError.notFound(locz().USER_USER_NOT_FOUND());
    }
    // check email
    const userEmails = request.emails;
    let { defaultEmail } = await emailUserCheck({ emails: userEmails });
    // update user
    let updateUser: User = GeneralUtility.filterObjectByInterface(request, user, ['id']);
    const resutlQry = await orm('User').where('id', request.id).update(updateUser).returning('id');
    // load user-dealer association
    const userDealers = await orm<User>('UserDealer').where('userId', request.id).select('id');
    if (userDealers.length != 1) {
      // wrong user dealer association
      throw APIError.unavailable(locz().USER_DEALER_TOO_MANY());
    }
    // update dealer
    if (request.dealerId) {
      // dealer must be associated
      if (userDealers.length == 1) {
        // user dealer association already exists
        // update user/dealer association
        const updateUserDealer: UserDealer = {
          userId: request.id,
          dealerId: request.dealerId,
        };
        await orm('UserDealer').where('id', userDealers[0].id).update(updateUserDealer);
      } else {
        // user dealer association not exist
        // associate dealer to user
        const newUserDealer: UserDealer = {
          userId: request.id,
          dealerId: request.dealerId,
        };
        await orm('UserDealer').insert(newUserDealer);
      }
    } else {
      // dealer not associated to user
      if (userDealers.length == 1) {
        // there's a dealer association
        // delete user dealer association
        await orm('UserDealer').where('id', userDealers[0].id).delete();
      }
    }
    // update emails
    await emailUserUpdate({ entityId: request.id, emails: userEmails });
    // update addresses
    const userAddresses = request.addresses;
    await addressUserUpdate({ entityId: request.id, addresses: userAddresses });
    // check user reactivation
    if (user.disabled && !request.disabled) {
      // user reactivated
      // send email to user
      return await GeneralUtility.emailSend({
        recipients: defaultEmail,
        subject: locz().USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT(),
        bodyHtml: locz().USER_ACTIVATED_EMAIL_BODY_HTML({ name: request.name, link: frontendBaseURL(), siteName: frontendBaseName() }),
        bodyText: locz().USER_ACTIVATED_EMAIL_BODY_TEXT({ name: request.name, link: frontendBaseURL() }),
      })
        .then(() => {
          // return updated user
          return userDetail({ id: resutlQry[0].id });
        })
        .catch((error) => {
          // error sending email
          throw APIError.unavailable(locz().EMAIL_SEND_ERROR());
        });
    } else {
      // return updated user
      return userDetail({ id: resutlQry[0].id });
    }
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userPasswordExpirationCheck',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to lock
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // get password expiration data
    return getUserPasswordExpiration(request.userId);
  }
); // userPasswordExpirationCheck

/**
 * Get data about user password expiration.
 * @param userId user unique identifier
 * @returns user password expiration data
 */
export const getUserPasswordExpiration = async (userId: number): Promise<UserPasswordExpirationResponse> => {
  // load last user history password
  const userPasswordHistory = await orm<UserPasswordHistory>('UserPasswordHistory').first().where('userId', userId).orderBy('date', 'DESC');
  if (!userPasswordHistory) {
    // last password history not found
    throw APIError.notFound(locz().USER_PASSWORD_HISTORY_NOT_FOUND());
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userStatusGet',
      requestingUserId: userId,
      destinationUserIds: [request.id],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().USER_STATUS_USER_NOT_ALLOWED());
    }
    // return user profile data
    const userStatus = await orm<UserStatusResponse>('User').first('name', 'surname', 'siteLocked').where('id', request.id);
    if (!userStatus) {
      // user not founded
      throw APIError.notFound(locz().USER_STATUS_USER_NOT_FOUND());
    }
    return DbUtility.removeNullFields(userStatus);
  }
); // userStatusGet

/**
 * Calculate user role weight.
 * Higher weight for higher access level.
 * SuperAdministrator > Administrator > Member
 * @param userRole user role
 * @returns user role weight
 */
export const getUserRoleWeight = (userRole: UserRole): number => {
  switch (userRole) {
    case UserRole.Member:
      return 100;
    case UserRole.Administrator:
      return 200;
    case UserRole.SuperAdministrator:
      return 300;
    default:
      return 0;
  }
}; // getUserRoleValue
