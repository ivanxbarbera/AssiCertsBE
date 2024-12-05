/**
 * Managed file entry types.
 */
export enum FileEntryType {
  Generic = 'GENERIC',
  ProfileImage = 'PROFILE_IMAGE',
} // FileEntryType

/**
 * File uploaded.
 */
export interface FileEntry {
  // file identificator
  id?: number;
  // user identificator
  userId: number;
  // file type
  type: FileEntryType;
  // file mime type
  mimeType: string;
  // filename
  filename: string;
  // file data stream
  data?: any[];
} // FileEntry

/**
 * File uploaded.
 */
export interface FileEntryResponse {
  // file identificator
  id: number;
  // user identificator
  userId: number;
  // file type
  type: FileEntryType;
  // file mime type
  mimeType: string;
  // filename
  filename: string;
  // download url
  downloadUrl: string;
  // download url is absolute (true) or relative (false)
  absoluteUrl: boolean;
} // FileEntryResponse

/**
 * File details request.
 */
export interface FileEntryRequest {
  // file identificator
  id: number;
} // FileEntryUploadResponse

/**
 * File upload response.
 */
export interface FileEntryUploadResponse {
  // file identificator
  id: number;
} // FileEntryUploadResponse

/**
 * File search list request with parameters filters.
 */
export interface FileEntryListRequest {
  // user identifier
  userId?: number;
  // file type
  type?: FileEntryType;
} // FileEntryListResponse

/**
 * File search list response.
 */
export interface FileEntryListResponse {
  // file list
  fileEntries: FileEntryResponse[];
} // FileEntryListResponse
