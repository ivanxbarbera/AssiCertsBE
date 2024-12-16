// application modules
import { UserRole } from '../user.model';

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
  // identifier of the user profile
  id: number;
  // user type
  type: UserRole;
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

/**
 * User create and update data.
 */
export interface UserProfileEditRequest {
  // identifier of the user profile
  id: number;
  // user email
  email: string;
  // user name
  name: string;
  // user surname
  surname: string;
  // user fiscal code
  fiscalCode?: string;
} // UserProfileEditRequest
