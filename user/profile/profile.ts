// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { UserProfileRequest, UserProfileResponse } from './profile.model';
import { AuthenticationData } from '../../authentication/authentication.model';
import { orm } from './../../db/db';

/**
 * User profile details.
 * Returns user profile data, a subset of user details, for getting user basic informations.
 */
export const userProfileGet = api(
  { expose: true, auth: true, method: 'GET', path: '/user/profile/:userId' },
  async (request: UserProfileRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId === request.userId) {
      // user can access his profile
      // return user profile data
      const userProfileQry = () => orm<UserProfileResponse>('user');
      const userProfile = await userProfileQry().first().where('id', request.userId);
      if (userProfile) {
        return userProfile;
      } else {
        // user not founded
        throw APIError.notFound('Requested user profil not fouded');
      }
    } else {
      // user not allowed to access
      throw APIError.permissionDenied('User not allowed to access requested data');
    }
  }
); // userProfileGet
