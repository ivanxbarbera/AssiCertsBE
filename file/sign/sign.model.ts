/**
 * Document sign prepare request.
 */
export interface SignDocumentPrepareRequest {} // SignDocumentPrepareRequest

/**
 * Document sign status request.
 */
export interface SignDocumentStatusRequest {
  // sign identifier
  id: string;
} // SignDocumentStatusRequest

/**
 * Document sign status response.
 */
export interface SignDocumentStatusResponse {
  // sign identifier
  id: string;
  // sign status
  status: string;
} // SignDocumentStatusResponse
