import type { Translation } from '../i18n-types';

const en = {
  AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: 'Email and password required',
  AUTHENTICATION_ACCESS_INVALID_TOKEN: 'Invalid token',
  AUTHENTICATION_ACCESS_UNKNOWN_USER: 'Unknown user',
  AUTHENTICATION_ACCESS_PASSWORD_EXPIRED: 'User password expired',
  AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION: 'Your password will expire in {expInDays} days.',
  AUTHENTICATION_ACCESS_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  AUTHENTICATION_ACCESS_USER_ID_REQUIRED: 'User identificator required',
  AUTHENTICATION_AUTHENTICATION_MALFORMED_REQUEST: 'Malformed request',
  AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED: 'Not authenticated',
  AUTHENTICATION_AUTHENTICATION_PASSWORD_EXPIRED: 'User password expired',
  NOTIFICATION_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_PROFILE_PROFILE_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_PROFILE_PROFILE_USER_NOT_FOUND: 'Requested user profile not found',
  USER_USER_PASSWORD_MATCH: 'Password and confirm password must be the same',
  USER_USER_PASSWORD_NOT_COMPLIANT: 'Password not compliant to required contraints',
  USER_USER_EMAIL_MALFORMED: 'Email address is not well formed',
  USER_USER_EMAIL_ALREADY_EXIST: 'User with specified email already exists',
  USER_USER_PASSWORD_HISTORY_NOT_FOUND: 'User password history not founded',
  USER_USER_RESET_REQ_NOT_FOUND: 'Password reset request not fouded',
  USER_USER_RESET_REQ_EXPIRED: 'Password reset request expired',
  USER_USER_RESET_REQ_USED: 'Password reset request already used',
  USER_USER_USER_NOT_FOUND: 'User not founded',
  USER_USER_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_USER_OLD_PASSWORD: 'Wrong old password',
  USER_USER_USED_PASSWORD: 'Password already used in past',
  USER_USER_PASSWORD_RESET_EMAIL_SUBJECT: 'Password reset request',
  USER_USER_PASSWORD_RESET_EMAIL_BODY_HTML:
    'Hello {name},<br>somebody asks to change your password. To proceed click link below.<br><a href="{link}">Reset password</a>',
  USER_USER_PASSWORD_RESET_EMAIL_BODY_TEXT: 'Hello {name},\nsomebody asks to change your password. To proceed click link below.\n{link}',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: 'Password reset confirm',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML:
    'Hello {name},<br>you password has been resetted. To login click on the link below.<br><a href="{link}">Login to Assihub</a>',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT: 'Hello {name},\nyou password has been resetted. To login click on the link below.\n{link}',
  USER_USER_PASSWORD_REGISTER_EMAIL_SUBJECT: 'Registration confirmed',
  USER_USER_PASSWORD_REGISTER_EMAIL_BODY_HTML: 'Hello {name},<br>you are successfully registered to Assihub. To login click on the link below.<br>',
  USER_USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT: 'Hello {name},\nyou are successfully registered to Assihub. To login click on the link below.\n',
  USER_USER_ACTIVATED_EMAIL_SUBJECT: 'Activation confirmed',
  USER_USER_ACTIVATED_EMAIL_BODY_HTML:
    'Hello {name},<br>your accound has been activated by an administrator. To login click on the link below..<br><a href="{link}">Accedi ad Assihub</a>',
  USER_USER_ACTIVATED_EMAIL_BODY_TEXT:
    'Hello {name},\nyour accound has been activated by an administrator. To login click on the link below.\n{link}',
} satisfies Translation;

export default en;
