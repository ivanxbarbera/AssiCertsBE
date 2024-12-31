/**
 * User type.
 */
export enum UserRole {
  // standard access user
  Member = 'MEMBER',
  // privileged user
  Administrator = 'ADMIN',
  // full access and site administrator user
  SuperAdministrator = 'SUPERADMIN',
} // UserType

/**
 * User data.
 */
export interface User {
  // user unique identifier
  id?: number;
  // user role
  role: UserRole;
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
  // user default language
  language?: string;
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
  // user unique identifier
  id?: number;
  // user role
  role: UserRole;
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
  // user default language
  language?: string;
} // UserResponse

/**
 * User create and update data.
 */
export interface UserEditRequest {
  // user unique identifier
  id?: number;
  // user role
  role: UserRole;
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
  // user default language
  language?: string;
} // UserEditRequest

/**
 * Single user data returned in user search.
 * This is a single element of the UserListResponse.
 */
export interface UserList {
  // user unique identifier
  id: number;
  // user role
  role: UserRole;
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
  // user password
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
  // passowrd min lenght compliance. true if complian, false otherwise
  hasMinLength: boolean;
  // passowrd lower case characters number compliance. true if complian, false otherwise
  hasLowerCase: boolean;
  // passowrd upper case characters number compliance. true if complian, false otherwise
  hasUpperCase: boolean;
  // passowrd number of number compliance. true if complian, false otherwise
  hasNumber: boolean;
  // passowrd special characters number compliance. true if complian, false otherwise
  hasSpecialChar: boolean;
} // UserPasswordCheckResponse

export interface UserPasswordHistory {
  // password history indentificator
  id?: number;
  // user indentificator
  userId: number;
  // password change data
  date: Date;
  // user encoded password
  passwordHash: string;
} // UserPasswordHistory

/**
 * User password history check request.
 * Check if password has been already used by user before.
 */
export interface UserPasswordHistoryCheckRequest {
  // user identifier
  userId: number;
  // user password
  password: string;
} // UserPasswordCheckRequest

/**
 * User password history check response.
 */
export interface UserPasswordHistoryCheckResponse {
  // password compliance. true can be used, false otherwise
  compliant: boolean;
} // UserPasswordCheckResponse

/**
 * User password expiration request.
 * Check the number of remaining days before password expiration.
 */
export interface UserPasswordExpirationRequest {
  // user identifier
  userId: number;
} // UserPasswordExpirationRequest

/**
 * User password expiration response.
 */
export interface UserPasswordExpirationResponse {
  // number of days before password expiration
  remainigDays: number;
  // true if password is expired, false otherwise
  expired: boolean;
  // true if a notification to user will be send, false otherwise
  notificationRequired: boolean;
} // UserPasswordExpirationResponse

/**
 * User status data request.
 * Request for user status information.
 */
export interface UserStatusRequest {
  // identifier of the logged user
  id: number;
} // UserStatusRequest

/**
 * User status information.
 * Contains a restricted set of user data.
 */
export interface UserStatusResponse {
  // logged user name
  name: string;
  // logged user surname
  surname: string;
  // logged user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // UserStatusResponse
