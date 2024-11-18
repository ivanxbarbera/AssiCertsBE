// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { UserProfileRequest, UserProfileResponse } from './profile.model';
import { AuthenticationData } from '../../authentication/authentication.model';
import { orm } from '../../common/db/db';
import locz from '../../common/i18n';

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
    // check user permission
    if (userId !== request.id) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().USER_PROFILE_PROFILE_USER_NOT_ALLOWED());
    }
    // return user profile data
    const userProfileQry = () => orm<UserProfileResponse>('User');
    const userProfile = await userProfileQry().first().where('id', request.id);
    if (!userProfile) {
      // user not founded
      throw APIError.notFound(locz().USER_PROFILE_PROFILE_USER_NOT_FOUND());
    }
    return userProfile;
  }
); // userProfileGet
