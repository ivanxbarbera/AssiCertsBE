/**
 * Captcha validation error type.
 */
export enum CaptchaErrorType {
  // internal error
  Internal = 'ERR_INTERNAL',
  // validation error
  Validation = 'ERR_VALIDATION',
  // unknown error
  Unknown = 'ERR_UNKNOWN',
} // CaptchaErrorType

/**
 * Request for captcha token verify.
 */
export interface CaptchaVerifyRequest {
  // captcha generated token
  token: string;
} // CaptchaVerifyRequest

/**
 * Response from captcha token verify.
 */
export interface CaptchaVerifyResponse {
  // validation status, true is validated, false otherwise
  validated: boolean;
  // api error response
  error?: CaptchaErrorType;
} // CaptchaVerifyResponse

/**
 * Request for CloudFlare Turnstile captcha verify.
 */
export interface CloudFlareTurnStyleRequest {
  // private cloudflare key
  secret: string;
  // token to be validated
  response: string;
  // ip address
  remoteip?: string;
  // random idempotency key
  idempotency_key?: string;
} // CloudFlareTurnStyleRequest

/**
 * Response from CloudFlare Turnstile captcha verify.
 */
export interface CloudFlareTurnStyleResponse {
  // Turnstile validation response, true validated, false otherwise
  success: boolean;
  // error code list on validation failure
  'error-codes': [];
  // validation timestamp
  challenge_ts: Date;
  // hostname
  hostname: string;
} // CloudFlareTurnStyleResponse

/**
 * Info on captcha configuration.
 */
export interface CaptchaStatusResponse {
  // captcha status, true active, false otherwise
  enabled: boolean;
  // public key
  publicKey?: string;
} // CaptchaStatusResponse
