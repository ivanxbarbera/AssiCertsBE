// application modules
import { EmailEditRequest, EmailResponse } from '../address/address.model';
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
  // user role
  role: UserRole;
  // logged user emails
  emails: EmailResponse[];
  // logged user name
  name: string;
  // logged user surname
  surname: string;
  // logged user fiscal code
  fiscalCode: string;
  // logged user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
  // user default language
  language?: string;
} // UserProfileResponse

/**
 * User create and update data.
 */
export interface UserProfileEditRequest {
  // identifier of the user profile
  id: number;
  // user emails
  emails: EmailEditRequest[];
  // user name
  name: string;
  // user surname
  surname: string;
  // user fiscal code
  fiscalCode?: string;
  // user default language
  language?: string;
} // UserProfileEditRequest
