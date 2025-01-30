/**
 * Document sign prepare request.
 */
export interface SignDocumentPrepareRequest {
  // request identifier
  requestId: string;
} // SignDocumentPrepareRequest

/**
 * Document sign status request.
 */
export interface SignDocumentStatusRequest {
  // request identifier
  requestId: string;
} // SignDocumentStatusRequest

/**
 * Document sign status response.
 */
export interface SignDocumentStatusResponse {
  // request identifier
  requestId: string;
  // reqeust status
  status: string;
} // SignDocumentStatusResponse
