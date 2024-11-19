import type { BaseTranslation } from '../i18n-types';

const it = {
  AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: 'Email e password sono obbligatori',
  AUTHENTICATION_ACCESS_INVALID_TOKEN: 'Token non valido',
  AUTHENTICATION_ACCESS_UNKNOWN_USER: 'Utente non riconosciuto',
  AUTHENTICATION_ACCESS_USER_ID_REQUIRES: 'Identificativo utente obbligatorio',
  AUTHENTICATION_AUTHENTICATION_MALFORMED_REQUEST: 'Richiesta non conforme',
  AUTHENTICATION_AUTHENTICATION_NOT_AUTHENTICATED: 'Non autenticato',
  USER_PROFILE_PROFILE_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_PROFILE_PROFILE_USER_NOT_FOUND: 'Profilo utente richiesto non trovato',
  USER_USER_PASSWORD_MATCH: 'Password e conferma password devono coincidere',
  USER_USER_EMAIL_MALFORMED: 'Indirizzo email non valido',
  USER_USER_EMAIL_ALREADY_EXIST: 'Utente con la mail indicata esistente',
  USER_USER_RESET_REQ_NOT_FOUND: 'Richiesta di rigenerazione password non trovata',
  USER_USER_RESET_REQ_EXPIRED: 'Richiesta di rigenerazione password scaduta',
  USER_USER_RESET_REQ_USED: 'Richiesta di rigenerazione password già usata',
  USER_USER_USER_NOT_FOUND: 'Utente non trovato',
  USER_USER_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_USER_OLD_PASSWORD: 'Password precedente non corretta',
  USER_USER_PASSWORD_RESET_EMAIL_SUBJECT: 'Richiesta ripristino password',
  USER_USER_PASSWORD_RESET_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>è stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.<br><a href="{link: string}">Ripristina password</a>',
  USER_USER_PASSWORD_RESET_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nè stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.\n{link: string}',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: 'Conferma ripristino password',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>la tua password è stata ripristinata. Per accedere clicca sul link seguente.<br><a href="{link: string}">Accedi ad Assihub</a>',
  USER_USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nla tua password è stata ripristinata. Per accedere clicca sul link seguente.\n{link: string}',
  USER_USER_PASSWORD_REGISTER_EMAIL_SUBJECT: 'Registrazione confermata',
  USER_USER_PASSWORD_REGISTER_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>sei stato correttamente registrato su Assihub. Per accedere clicca sul link seguente.<br><a href="{link: string}">Accedi ad Assihub</a>',
  USER_USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nsei stato correttamente registrato su Assihub. Per accedere clicca sul link seguente..\n{link: string}',
} satisfies BaseTranslation;

export default it;
