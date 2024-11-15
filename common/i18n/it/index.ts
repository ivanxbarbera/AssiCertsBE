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
} satisfies BaseTranslation;

export default it;
