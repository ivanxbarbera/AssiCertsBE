import type { Translation } from '../i18n-types';

const en = {
  AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: 'Email and password required',
  AUTHENTICATION_ACCESS_INVALID_TOKEN: 'Invalid token',
  AUTHENTICATION_ACCESS_UNKNOWN_USER: 'Unknown user',
  AUTHENTICATION_ACCESS_USER_ID_REQUIRES: 'User identificator required',
  AUTHENTICATION_AUTHENTICATION_MALFORMED_REQUEST: 'Malformed request',
  AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED: 'Not authenticated',
  USER_PROFILE_PROFILE_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_PROFILE_PROFILE_USER_NOT_FOUND: 'Requested user profile not found',
  USER_USER_PASSWORD_MATCH: 'Password and confirm password must be the same',
  USER_USER_EMAIL_MALFORMED: 'Email address is not well formed',
  USER_USER_EMAIL_ALREADY_EXIST: 'User with specified email already exists',
  USER_USER_RESET_REQ_NOT_FOUND: 'Password reset request not fouded',
  USER_USER_RESET_REQ_EXPIRED: 'Password reset request expired',
  USER_USER_RESET_REQ_USED: 'Password reset request already used',
  USER_USER_USER_NOT_FOUND: 'User not founded',
  USER_USER_USER_NOT_ALLOWED: 'User not allowed to access requested data',
} satisfies Translation;

export default en;
