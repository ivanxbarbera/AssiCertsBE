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
  // user fiscal code
  fiscalCode?: string;
  // user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
  // user status, disabled or active
  disabled: boolean;
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
  // user fiscal code
  fiscalCode?: string;
  // user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
  // user status, disabled or active
  disabled: boolean;
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
  // user fiscal code
  fiscalCode?: string;
  // user status, disabled or active
  disabled: boolean;
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
  // user status, disabled or active
  disabled: boolean;
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
 * User password change request.
 */
export interface UserPasswordChangeRequest {
  // user indentifier
  userId: number;
  // previuos password
  oldPassword: string;
  // new user password
  password: string;
  // new user password confirm
  passwordConfirm: string;
} // UserPasswordResetConfirmRequest

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

/**
 * User password compliance to contraints check request.
 */
export interface UserPasswordCheckRequest {
  password: string;
} // UserPasswordCheckRequest

/**
 * User password validity compliance response.
 */
export interface UserPasswordCheckResponse {
  // password score value. max value 12
  score: number;
  // password strenght
  strength: string;
  // password compliance. true can be used, false otherwise
  compliant: boolean;
} // UserPasswordCheckResponse
