// libraries
import { api } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
// application modules
import {
  CaptchaErrorType,
  CaptchaStatusResponse,
  CaptchaVerifyRequest,
  CaptchaVerifyResponse,
  CloudFlareTurnStyleRequest,
  CloudFlareTurnStyleResponse,
} from './captcha.model';

const captchaValdationEnabled = secret('CaptchaValdationEnabled');
const cloudFlareTurnstileUrl = secret('CloudFlareTurnstileUrl');
const cloudFlareTurnstileKeySecret = secret('CloudFlareTurnstileKeySecret');
const cloudFlareTurnstileKeyPublic = secret('CloudFlareTurnstileKeyPublic');

/**
 * Return capthca status.
 */
export const captchaStatusGet = api(
  { expose: true, method: 'GET', path: '/authentication/captcha/status' },
  async (): Promise<CaptchaStatusResponse> => {
    // prepare response
    const response: CaptchaStatusResponse = {
      enabled: captchaValdationEnabled() === 'true',
      publicKey: cloudFlareTurnstileKeyPublic(),
    };
    // return status
    return response;
  }
); // captchaStatusGet

/**
 * Capthca verify.
 */
export const captchaVerify = api(
  { expose: false, method: 'POST', path: '/authentication/captcha/verify' },
  async (request: CaptchaVerifyRequest): Promise<CaptchaVerifyResponse> => {
    // call Turnstile check
    return cloudFlareTurnstileVerify(request);
  }
); // captchaVerify

/**
 * CloudFlare Turnstile captcha verify.
 */
export const cloudFlareTurnstileVerify = async (request: CaptchaVerifyRequest): Promise<CaptchaVerifyResponse> => {
  // prepare cloudflare request
  // TODO MIC evaluate missing request data
  const TurnstileRequest: CloudFlareTurnStyleRequest = {
    secret: cloudFlareTurnstileKeySecret(),
    response: request.token,
  };
  const TurnstileUrl = cloudFlareTurnstileUrl();
  // call cloudflare for validation
  const TurnstileResponse = await fetch(TurnstileUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(TurnstileRequest),
  });
  const data: CloudFlareTurnStyleResponse = (await TurnstileResponse.json()) as CloudFlareTurnStyleResponse;
  // prepare verification response
  const response: CaptchaVerifyResponse = {
    validated: data.success,
  };
  if (!data.success) {
    // check response
    const invalidCodes = ['timeout-or-duplicate', 'invalid-input-response', 'invalid-input-secret'];
    const isInvalid = data['error-codes'].some((code) => invalidCodes.includes(code));
    const errorCodes = ['missing-input-secret', 'missing-input-response', 'bad-request', 'internal-error'];
    const isError = data['error-codes'].some((code) => errorCodes.includes(code));
    // set error
    response.error = isError ? CaptchaErrorType.Internal : isInvalid ? CaptchaErrorType.Validation : CaptchaErrorType.Unknown;
  }
  return response;
}; // cloudFlareTurnstileVerify
