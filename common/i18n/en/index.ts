import type { Translation } from '../i18n-types';

const en = {
  AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: 'Email and password required',
  AUTHENTICATION_ACCESS_INVALID_TOKEN: 'Invalid token',
  AUTHENTICATION_ACCESS_UNKNOWN_USER: 'Unknown user',
  AUTHENTICATION_ACCESS_PASSWORD_EXPIRED: 'User password expired',
  AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION: 'Your password will expire in {expInDays} days.',
  AUTHENTICATION_ACCESS_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  AUTHENTICATION_ACCESS_USER_ID_REQUIRED: 'User identifier required',
  AUTHENTICATION_ACCESS_CAPTCHA_INTERNAL: 'Error during captcha validation',
  AUTHENTICATION_ACCESS_CAPTCHA_UNKNOWN: 'Error in captcha management',
  AUTHENTICATION_ACCESS_CAPTCHA_VALIDATION: 'Captcha validation refused',
  AUTHENTICATION_MALFORMED_REQUEST: 'Malformed request',
  AUTHENTICATION_NOT_AUTHENTICATED: 'Not authenticated',
  AUTHENTICATION_PASSWORD_EXPIRED: 'User password expired',
  AUTHENTICATION_USER_NOT_FOUND: 'Authenticated user not found',
  EMAIL_SEND_ERROR: 'Error sending email. Contact technical support.',
  FILE_FILE_NOT_FOUND: 'File not founded',
  FILE_SIGN_YOUSIGN_SIGN_REQUEST_ERROR: 'Error during sign request creation',
  FILE_SIGN_YOUSIGN_DOCUMENT_UPLOAD_ERROR: 'Error uploading document to be signed',
  FILE_SIGN_YOUSIGN_SIGNER_ADD_ERROR: 'Error adding signer to document sign request',
  FILE_SIGN_YOUSIGN_ACTIVATE_ERROR: 'Error activating sign request',
  FILE_SIGN_YOUSIGN_REQUEST_FETCHING_ERROR: 'Error fetching document sign request status',
  FILE_SIGN_YOUSIGN_DOCUMENT_SIGN_ERROR: 'Errore generico nella firma del documento',
  MUNICIPALITY_FILE_GET_ERROR: 'Error getting municipality file to be processed',
  MUNICIPALITY_FILE_PROCESS_ERROR: 'Error processing municipality file',
  NOTIFICATION_NOTIFICATION_NOT_FOUND: 'Notification not found',
  NOTIFICATION_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  SYSTEM_PARAMETER_NOT_FOUND: 'System parameter not founded',
  SYSTEM_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_ADDRESS_EMAILTYPE_NOT_FOUND: 'Email Type not founded',
  USER_PROFILE_EMAIL_ALREADY_EXIST: 'User with specified email already exists',
  USER_PROFILE_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_PROFILE_USER_NOT_FOUND: 'Requested user profile not found',
  USER_DOMAIN_NOT_ALLOWED: 'Email domain is not in allowed list',
  USER_PASSWORD_MATCH: 'Password and confirm password must be the same',
  USER_PASSWORD_NOT_COMPLIANT: 'Password not compliant to required contraints',
  USER_EMAIL_MALFORMED: 'Email address is not well formed',
  USER_EMAIL_ALREADY_EXIST: 'User with email {email} already exists',
  USER_EMAIL_NOT_FOUND: 'User email with ID {id} not exists',
  USER_EMAIL_DEFAULT_EXIST: 'User can only have one default email',
  USER_EMAIL_DEFAULT_UNDEFINED: 'User must have at least one default email',
  USER_EMAIL_AUTHENTICATION_EXIST: 'User can only have one authentication email',
  USER_EMAIL_AUTHENTICATION_UNDEFINED: 'User must have at least one authetication email',
  USER_PASSWORD_HISTORY_NOT_FOUND: 'User password history not founded',
  USER_RESET_REQ_NOT_FOUND: 'Password reset request not fouded',
  USER_RESET_REQ_EXPIRED: 'Password reset request expired',
  USER_RESET_REQ_USED: 'Password reset request already used',
  USER_STATUS_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_STATUS_USER_NOT_FOUND: 'Requested user profile not found',
  USER_USER_NOT_FOUND: 'User not founded',
  USER_USER_NOT_ALLOWED: 'User not allowed to access requested data',
  USER_OLD_PASSWORD: 'Wrong old password',
  USER_USED_PASSWORD: 'Password already used in past',
  USER_PASSWORD_RESET_EMAIL_SUBJECT: 'Password reset request',
  USER_PASSWORD_RESET_EMAIL_BODY_HTML:
    'Hello {name},<br>somebody asks to change your password. To proceed click link below.<br><a href="{link}">Reset password</a>',
  USER_PASSWORD_RESET_EMAIL_BODY_TEXT: 'Hello {name},\nsomebody asks to change your password. To proceed click link below.\n{link}',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: 'Password reset confirm',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML:
    'Hello {name},<br>you password has been resetted. To login click on the link below.<br><a href="{link}">Login to Assihub</a>',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT: 'Hello {name},\nyou password has been resetted. To login click on the link below.\n{link}',
  USER_PASSWORD_REGISTER_EMAIL_SUBJECT: 'Registration confirmed',
  USER_PASSWORD_REGISTER_EMAIL_BODY_HTML:
    'Hello {name},<br>you are successfully registered to Assihub. Wait for you account activation by an administrator.<br>',
  USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT:
    'Hello {name},\nyou are successfully registered to Assihub. Wait for you account activation by an administrator.\n',
  USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE: 'The user {name} {surname} has just registered.',
  USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE_DETAIL:
    'The user is not active. Through the link it is possible to modify it for configuring the role and activate it to allow it to connect.',
  USER_ACTIVATED_EMAIL_SUBJECT: 'Activation confirmed',
  USER_ACTIVATED_EMAIL_BODY_HTML:
    'Hello {name},<br>your accound has been activated by an administrator. To login click on the link below.<br><a href="{link}">Login to {siteName}</a>',
  USER_ACTIVATED_EMAIL_BODY_TEXT: 'Hello {name},\nyour accound has been activated by an administrator. To login click on the link below.\n{link}',
} satisfies Translation;

export default en;
