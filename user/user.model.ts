/**
 * User profile data request.
 * Request from caller for user profile details.
 */
export interface UserProfileRequest {
  userId: string;
} // UserProfileRequest

/**
 * User profile data response.
 * Data returned to caller with user profile details.
 * Contains a restricted set of user data.
 */
export interface UserProfileResponse {
  email: string;
  name: string;
  surname: string;
} // UserProfileResponse
