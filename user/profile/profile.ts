// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { DbUtility } from './../../common/utility/db.utility';
import { UserProfileEditRequest, UserProfileRequest, UserProfileResponse } from './profile.model';
import { AuthenticationData } from '../../authentication/authentication.model';
import { orm } from '../../common/db/db';
import locz from '../../common/i18n';
import { authorizationOperationUserCheck } from '../../authorization/authorization';
import { AuthorizationOperationResponse } from '../../authorization/authorization.model';
import { EmailListResponse } from '../address/address.model';
import { emailUserCheck, emailListByUser, emailUserUpdate } from '../address/address';
import { User } from '../user.model';
import { GeneralUtility } from '../../common/utility/general.utility';

/**
 * User profile details.
 * Returns user profile data, a subset of user details, for getting user basic informations.
 */
export const userProfileGet = api(
  { expose: true, auth: true, method: 'GET', path: '/user/profile/:id' },
  async (request: UserProfileRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userProfileGet',
      requestingUserId: userId,
      destinationUserIds: [request.id],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().USER_PROFILE_USER_NOT_ALLOWED());
    }
    // return user profile data
    const userProfile = await orm<UserProfileResponse>('User').first().where('id', request.id);
    if (!userProfile) {
      // user not founded
      throw APIError.notFound(locz().USER_PROFILE_USER_NOT_FOUND());
    }
    // load user profile emails
    const emailList: EmailListResponse = await emailListByUser({ entityId: userProfile.id });
    userProfile.emails = emailList.emails;
    // return user profile
    return DbUtility.removeNullFields(userProfile);
  }
); // userProfileGet

/**
 * Update user profile.
 */
export const userProfileUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/user/profile/:id' },
  async (request: UserProfileEditRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'userProfileUpdate',
      requestingUserId: userId,
      destinationUserIds: [request.id],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().USER_PROFILE_USER_NOT_ALLOWED());
    }
    // load user profile
    const userProfile = await orm<User>('User').first().where('id', request.id);
    if (!userProfile) {
      // user not found
      throw APIError.notFound(locz().USER_PROFILE_USER_NOT_FOUND());
    }
    // check email
    const userEmails = request.emails;
    await emailUserCheck({ emails: userEmails });
    // update user profile
    let updateUserProfile: User = GeneralUtility.filterObjectByInterface(request, userProfile, ['id']);
    const resutlQry = await orm('User').where('id', request.id).update(updateUserProfile).returning('id');
    const userEditId = resutlQry[0].id;
    // update emails
    await emailUserUpdate({ entityId: userEditId, emails: userEmails });
    // return updated user profile
    return userProfileGet({ id: userEditId });
  }
); // userProfileUpdate
