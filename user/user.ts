// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { UserProfileRequest, UserProfileResponse } from './user.model';
import { AuthenticationData } from './../authentication/authentication.model';

/**
 * User profile details.
 * Request for user profiles.
 */
export const userProfileGet = api(
  { expose: true, auth: true, method: 'GET', path: '/user/profile/:userId' },
  async (request: UserProfileRequest): Promise<UserProfileResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    // check user permission
    if (authenticationData.userID === request.userId) {
      // user can access his profile
      // prepare user profile data
      const userProfile: UserProfileResponse = {
        email: 'john@assihub.it',
        name: 'John',
        surname: 'Doe',
      };
      return userProfile;
    } else {
      // user not allowed to access
      throw APIError.permissionDenied('User not allowed to access requested data');
    }
  }
); // userProfileGet
