import type { BaseTranslation } from '../i18n-types';

const it = {
  AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: 'Email e password sono obbligatori',
  AUTHENTICATION_ACCESS_INVALID_TOKEN: 'Token non valido',
  AUTHENTICATION_ACCESS_UNKNOWN_USER: 'Utente non riconosciuto',
  AUTHENTICATION_ACCESS_PASSWORD_EXPIRED: 'Password utente scaduta',
  AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION: 'La tua password scadrà tra {expInDays: number} giorni',
  AUTHENTICATION_ACCESS_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  AUTHENTICATION_ACCESS_USER_ID_REQUIRED: 'Identificativo utente obbligatorio',
  AUTHENTICATION_ACCESS_CAPTCHA_INTERNAL: 'Errore nel controllo di validazione del captcha',
  AUTHENTICATION_ACCESS_CAPTCHA_UNKNOWN: 'Errore nella gestione del captcha',
  AUTHENTICATION_ACCESS_CAPTCHA_VALIDATION: 'La validazione del captcha è stata rifiutata',
  AUTHENTICATION_MALFORMED_REQUEST: 'Richiesta non conforme',
  AUTHENTICATION_NOT_AUTHENTICATED: 'Non autenticato',
  AUTHENTICATION_PASSWORD_EXPIRED: 'Password utente scaduta',
  AUTHENTICATION_USER_NOT_FOUND: 'Authenticated user not found',
  EMAIL_SEND_ERROR: "Errore nell'invio della Mail. Contattare il supporto tecnico.",
  FILE_FILE_NOT_FOUND: 'File non trovato',
  FILE_SIGN_YOUSIGN_SIGN_REQUEST_ERROR: 'Errore nella creazione delle richiesta di firma',
  FILE_SIGN_YOUSIGN_DOCUMENT_UPLOAD_ERROR: 'Errore nel caricamento del documento da firmare',
  FILE_SIGN_YOUSIGN_SIGNER_ADD_ERROR: "Errore nell'aggiunta del firmatario alla richiesta di firma del documento",
  FILE_SIGN_YOUSIGN_ACTIVATE_ERROR: "Errore nell'attivazione della richiesta di firma del documento",
  FILE_SIGN_YOUSIGN_DOCUMENT_SIGN_ERROR: 'Errore generico nella firma del documento',
  MUNICIPALITY_FILE_GET_ERROR: 'Errore nel recupero del file dei comuni da elaborare',
  MUNICIPALITY_FILE_PROCESS_ERROR: "Errore nel nell'elaborazione del file dei comnuni",
  NOTIFICATION_NOTIFICATION_NOT_FOUND: 'Notifica non trovata',
  NOTIFICATION_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  SYSTEM_PARAMETER_NOT_FOUND: 'Parametro di sistema non trovato',
  SYSTEM_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_ADDRESS_EMAILTYPE_NOT_FOUND: 'Tipo Email non trovato',
  USER_PROFILE_EMAIL_ALREADY_EXIST: 'Utente con la mail indicata esistente',
  USER_PROFILE_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_PROFILE_USER_NOT_FOUND: 'Profilo utente richiesto non trovato',
  USER_DOMAIN_NOT_ALLOWED: 'Il dominio della email non è tra quelli consentiti',
  USER_PASSWORD_MATCH: 'Password e conferma password devono coincidere',
  USER_PASSWORD_NOT_COMPLIANT: 'Password non conforme ai requisiti richiesti',
  USER_EMAIL_MALFORMED: 'Indirizzo email non valido',
  USER_EMAIL_ALREADY_EXIST: 'Utente con la mail {email: string} esistente',
  USER_EMAIL_NOT_FOUND: 'La mail con ID {id:number} non esiste',
  USER_EMAIL_DEFAULT_EXIST: 'Un utente può avere solo una email di default',
  USER_EMAIL_DEFAULT_UNDEFINED: 'Un utente deve avere almeno una email di default',
  USER_EMAIL_AUTHENTICATION_EXIST: 'Un utente può avere solo una email di autenticazione',
  USER_EMAIL_AUTHENTICATION_UNDEFINED: 'Un utente deve avere almeno una email di autenticazione',
  USER_PASSWORD_HISTORY_NOT_FOUND: 'Storico password utente non trovato',
  USER_RESET_REQ_NOT_FOUND: 'Richiesta di rigenerazione password non trovata',
  USER_RESET_REQ_EXPIRED: 'Richiesta di rigenerazione password scaduta',
  USER_RESET_REQ_USED: 'Richiesta di rigenerazione password già usata',
  USER_STATUS_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_STATUS_USER_NOT_FOUND: 'Stato utente richiesto non trovato',
  USER_USER_NOT_FOUND: 'Utente non trovato',
  USER_USER_NOT_ALLOWED: 'Utente non autorizzato ad accedere ai dati richiesti',
  USER_OLD_PASSWORD: 'Password precedente non corretta',
  USER_USED_PASSWORD: 'Password già usata in precedenza',
  USER_PASSWORD_RESET_EMAIL_SUBJECT: 'Richiesta ripristino password',
  USER_PASSWORD_RESET_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>è stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.<br><a href="{link: string}">Ripristina password</a>',
  USER_PASSWORD_RESET_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nè stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.\n{link: string}',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: 'Conferma ripristino password',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>la tua password è stata ripristinata. Per accedere clicca sul link seguente.<br><a href="{link: string}">Accedi ad Assihub</a>',
  USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nla tua password è stata ripristinata. Per accedere clicca sul link seguente.\n{link: string}',
  USER_PASSWORD_REGISTER_EMAIL_SUBJECT: 'Registrazione confermata',
  USER_PASSWORD_REGISTER_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>sei stato correttamente registrato su Assihub. Attendi che un amministratore abiliti il tuo account.',
  USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nsei stato correttamente registrato su Assihub. Attendi che un amministratore abiliti il tuo accout.\n',
  USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE: "L'utente {name: string} {surname: string} si è appena registrato.",
  USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE_DETAIL:
    "L'utente non è attivo. Tramite il link è possibile modificarlo per configurare il ruolo e attivarlo per consentirne la connessione.",
  USER_ACTIVATED_EMAIL_SUBJECT: 'Attivazione confermata',
  USER_ACTIVATED_EMAIL_BODY_HTML:
    'Ciao {name: string},<br>il tuo account è stato attivato da un amministratore. Per accedere clicca sul link seguente.<br><a href="{link: string}">Accedi ad {siteName: string}</a>',
  USER_ACTIVATED_EMAIL_BODY_TEXT:
    'Ciao {name: string},\nsei stato correttamente registrato su Assihub. Per accedere clicca su link seguente.\n{link: string}',
} satisfies BaseTranslation;

export default it;
