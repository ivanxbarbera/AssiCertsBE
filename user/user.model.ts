/**
 * User data.
 */
export interface User {
  // user unique identificator
  id?: number;
  // loggend user email
  email: string;
  // user encoded password
  passwordHash: string;
  // logged user name
  name: string;
  // logged user surname
  surname: string;
  // logged user site locking status. true is locked, false is unlocked
  siteLocked: boolean;
} // User

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
  // logged user name
  name: string;
  // logged user surname
  surname: string;
} // UserRegisterRequest

/**
 * User password reset request.
 */
export interface UserPasswordResetRequest {
  // user email address
  email: string;
} // UserPasswordReserRequest

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
} // UserPasswordReserRequest

/**
 * User password reset confirmation response.
 */
export interface UserPasswordResetConfirm {
  // user email address
  email: string;
} // UserPasswordResetConfirm

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
 * User site lock and unlock request.
 */
export interface UserSiteLockUnlockRequest {
  // user identifier
  id: number;
} // UserSiteLockUnlockRequest
