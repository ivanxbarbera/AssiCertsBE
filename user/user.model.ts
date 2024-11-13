/**
 * User data.
 */
export interface User {
  // user unique identificator
  id?: number;
  // user email
  email: string;
  // user encoded password
  passwordHash: string;
  // user name
  name: string;
  // user surname
  surname: string;
  // user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // User

/**
 * User data request.
 * Request for user profile details.
 */
export interface UserRequest {
  // identifier of the logged user
  id: number;
} // UserRequest

/**
 * User data.
 */
export interface UserResponse {
  // user unique identificator
  id?: number;
  // user email
  email: string;
  // user name
  name: string;
  // user surname
  surname: string;
  // user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // UserResponse

/**
 * User create and update data.
 */
export interface UserEditRequest {
  // user unique identificator
  id?: number;
  // user email
  email: string;
  // user name
  name: string;
  // user surname
  surname: string;
} // UserEditRequest

/**
 * Single user data returned in user search.
 * This is a single element of the UserListResponse.
 */
export interface UserList {
  // user unique identificator
  id: number;
  // user email
  email: string;
  // user name
  name: string;
  // user surname
  surname: string;
} // UserList

/**
 * User search list response.
 */
export interface UserListResponse {
  // user list
  users: UserList[];
} // UserListResponse

/**
 * User data.
 */
export interface UserRegisterRequest {
  // loggend user email
  email: string;
  // user password
  password: string;
  // new user password confirm
  passwordConfirm: string;
  // user name
  name: string;
  // user surname
  surname: string;
} // UserRegisterRequest

/**
 * User password reset request.
 */
export interface UserPasswordResetRequest {
  // user email address
  email: string;
} // UserPasswordResetRequest

/**
 * User password reset request.
 */
export interface UserPasswordResetConfirmRequest {
  // password reset token request
  token: string;
  // new user password
  password: string;
  // new user password confirm
  passwordConfirm: string;
} // UserPasswordResetConfirmRequest

/**
 * User password reset confirmation response.
 */
export interface UserPasswordResetConfirmResponse {
  // user email address
  email: string;
} // UserPasswordResetConfirmResponse

/**
 * User password reset.
 */
export interface UserPasswordReset {
  // user password reset unique indentifier
  id?: number;
  // user indentifier
  userId: number;
  // token for password regeneration
  token: string;
  // token expires time
  expiresAt: Date;
  // used token. true if already used, false otherwise
  used: boolean;
} // UserPasswordReset

/**
 * User site lock request.
 */
export interface UserSiteLockRequest {
  // user identifier
  id: number;
} // UserSiteLockRequest

/**
 * User site unlock request.
 */
export interface UserSiteUnlockRequest {
  // user identifier
  id: number;
  // user password
  password: string;
} // UserSiteUnlockRequest
