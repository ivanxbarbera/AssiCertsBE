/**
 * User profile data request.
 * Request from caller for user profile details.
 */
export interface UserProfileRequest {
  // identifier of the logged user
  id: number;
} // UserProfileRequest

/**
 * User profile data.
 * Contains a restricted set of user data.
 */
export interface UserProfile {
  // loggend user email
  email: string;
  // logged user name
  name: string;
  // logged user surname
  surname: string;
  // logged user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // UserProfile
