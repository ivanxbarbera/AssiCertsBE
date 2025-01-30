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
export interface YouSignSignDocumentRequest {
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
} // YouSignSignDocumentRequest

/**
 * Request for document sign by YouSign.
 */
export interface YouSignSignDocumentResponse {
  // signature request identifier
  signatureRequestId: string;
} // YouSignSignDocumentResponse

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
