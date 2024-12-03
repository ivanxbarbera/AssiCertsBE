/**
 * User profile data request.
 * Request for user profile details.
 */
export interface UserProfileRequest {
  // identifier of the logged user
  id: number;
} // UserProfileRequest

/**
 * User profile data.
 * Contains a restricted set of user data.
 */
export interface UserProfileResponse {
  // loggend user email
  email: string;
  // logged user name
  name: string;
  // logged user surname
  surname: string;
  // logged user fiscal code
  fiscalCode: string;
  // logged user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // UserProfileResponse
