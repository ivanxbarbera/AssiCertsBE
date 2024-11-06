/**
 * User profile data request.
 * Request from caller for user profile details.
 */
export interface UserProfileRequest {
  // identifier of the logged user
  userId: number;
} // UserProfileRequest

/**
 * User profile data response.
 * Data returned to caller with user profile details.
 * Contains a restricted set of user data.
 */
export interface UserProfileResponse {
  // loggend user email
  email: string;
  // logged user name
  name: string;
  // logged user surname
  surname: string;
} // UserProfileResponse
