/**
 * YouSign OTP notification type.
 */
export enum YouSignOtpNotificationType {
  // OTP notification by email
  EMail = 'otp_email',
  // OTP notification by SMS
  Sms = 'otp_sms',
} // YouSignOtpNotificationType

/**
 * Request for document sign by YouSign.
 */
export interface YouSignDocumentSignRequest {
  // stream of the document to sign
  documentStream: Blob;
  // signer of the document
  signer: {
    // signer first name
    firstName: string;
    // signer last name
    lastName: string;
    // signer email address
    email: string;
    // signer phone number
    phoneNumber: string;
    // signer locale
    locale: string;
    // signer time zone
    timeZone: string;
    // OTP notification type
    otpNotificationType: YouSignOtpNotificationType;
  };
} // YouSignDocumentSignRequest

/**
 * Document sign status request by YouSign.
 */
export interface YouSignDocumentStatusRequest {
  // signature request identifier
  id: string;
} // YouSignDocumentStatusRequest

/**
 * Document sign request status by YouSign.
 */
export interface YouSignDocumentStatusResponse {
  // signer unique identifier
  id: string;
  // request status
  status: string;
} // YouSignDocumentStatusResponse

/**
 * YouSign response for new sign request.
 */
export interface YouSignSignatureRequestResponse {
  // sign request unique identifier
  id: string;
  // status of the request
  status: string;
} // YouSignSignatureRequestResponse

/**
 * YouSign response for uploaded document.
 */
export interface YouSignDocumentUploadResponse {
  // uploaded file unique identifier
  id: string;
} // YouSignDocumentUploadResponse

/**
 * YouSign response for signer creation.
 */
export interface YouSignSignerResponse {
  // signer unique identifier
  id: string;
} // YouSignSignerResponse

/**
 * YouSign response for sign request status.
 */
export interface YouSignRequestStatusResponse {
  // signer unique identifier
  id: string;
  // request status
  status: string;
} // YouSignRequestStatusResponse
