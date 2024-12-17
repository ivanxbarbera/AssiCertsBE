import { DbUtility } from './../../common/utility/db.utility';
// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { UserProfileEditRequest, UserProfileRequest, UserProfileResponse } from './profile.model';
import { AuthenticationData } from '../../authentication/authentication.model';
import { orm } from '../../common/db/db';
import locz from '../../common/i18n';
import { authorizationOperationUserCheck } from '../../authorization/authorization';
import { AuthorizationOperationResponse } from '../../authorization/authorization.model';

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
    const userProfileQry = () => orm<UserProfileResponse>('User');
    const userProfile = await userProfileQry().first().where('id', request.id);
    if (!userProfile) {
      // user not founded
      throw APIError.notFound(locz().USER_PROFILE_USER_NOT_FOUND());
    }
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
    const userProfileQry = () => orm<UserProfileResponse>('User');
    const userProfile = await userProfileQry().first().where('id', request.id);
    if (!userProfile) {
      // user not found
      throw APIError.notFound(locz().USER_PROFILE_USER_NOT_FOUND());
    }
    if (userProfile.email !== request.email) {
      // user changed his email
      // check for mail existance
      const emailCount = (await orm('User').count('id').where('email', request.email))[0]['count'] as number;
      if (emailCount > 0) {
        // email already exists
        throw APIError.alreadyExists(locz().USER_PROFILE_EMAIL_ALREADY_EXIST());
      }
    }
    // update user profile
    const userProfileUpdateQry = () => orm('User');
    const resutlQry = await userProfileUpdateQry().where('id', request.id).update(request, ['id']);
    // return updated user profile
    return userProfileGet({ id: resutlQry[0].id });
  }
); // userProfileUpdate
