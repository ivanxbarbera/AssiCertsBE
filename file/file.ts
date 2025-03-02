// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
import busboy from 'busboy';
import { secret } from 'encore.dev/config';
import { IncomingMessage, ServerResponse } from 'http';
import { APICallMeta, currentRequest } from 'encore.dev';
import { jwtVerify, SignJWT } from 'jose';
// application modules
import {
  FileEntry,
  FileEntryListRequest,
  FileEntryListResponse,
  FileEntryRequest,
  FileEntryResponse,
  FileEntryType,
  FileEntryUploadResponse,
} from './file.model';
import { orm } from '../common/db/db';
import { AuthenticationData } from '../authentication/authentication.model';
import locz from '../common/i18n';
import { DbUtility } from '../common/utility/db.utility';

const jwtSercretKey = secret('JWTSecretKey');
const fileDownloadDurationInMinutes = secret('FileDownloadDurationInMinutes');

/**
 * Prepare file for response.
 * @param fileEntry file to be prepared for response
 * @returns file to be sent in response
 */
const fileEntryPrepareResponse = async (fileEntry: FileEntry): Promise<FileEntryResponse> => {
  // generate token
  const expiresIn: number = +fileDownloadDurationInMinutes();
  const token: string = await new SignJWT({ userId: fileEntry.userId, fileId: fileEntry.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn + 'minute')
    .sign(new TextEncoder().encode(jwtSercretKey()));
  // create file response
  const fileEntryResponse: FileEntryResponse = {
    id: fileEntry.id!,
    userId: fileEntry.userId,
    type: fileEntry.type,
    mimeType: fileEntry.mimeType,
    filename: fileEntry.filename,
    downloadUrl: `/file/blob/${fileEntry.id!}/${token}`,
    absoluteUrl: false,
  };
  // return file response
  return DbUtility.removeNullFields(fileEntryResponse);
}; // fileEntryPrepareResponse

/**
 * Search for files.
 * Apply filters and return a list of files.
 */
export const fileEntryList = api(
  { expose: true, auth: true, method: 'GET', path: '/file' },
  async (request: FileEntryListRequest): Promise<FileEntryListResponse> => {
    // TODO MIC check for authorization
    // load files
    const fileEntriesRst = await orm<FileEntry>('FileEntry')
      .select('id', 'userId', 'type', 'mimeType', 'filename')
      .where((whereBuilder) => {
        // add search filters
        if (request.userId) {
          whereBuilder.where('userId', request.userId);
        }
        if (request.type) {
          whereBuilder.where('type', request.type);
        }
      });
    // prepare files for response
    const fileEntries: FileEntryResponse[] = await Promise.all(
      fileEntriesRst.map(async (fileEntryRst) => {
        return await fileEntryPrepareResponse(fileEntryRst);
      })
    );
    // return files
    return {
      fileEntries,
    };
  }
); // fileEntryList

/**
 * Load file entry details.
 */
export const fileEntryDetails = api(
  { expose: true, auth: true, method: 'GET', path: '/file/:id' },
  async (request: FileEntryRequest): Promise<FileEntryResponse> => {
    // TODO MIC check for authorization
    // load file
    const fileEntry = await orm<FileEntryResponse>('FileEntry').first('id', 'userId', 'type', 'mimeType', 'filename').where('id', request.id);
    if (!fileEntry) {
      // file not found
      throw APIError.notFound(locz().FILE_FILE_NOT_FOUND());
    }
    // return file entry
    return await fileEntryPrepareResponse(fileEntry);
  }
); // fileEntryDetails

/**
 * Upload a new file associate to the spicified user.
 */
export const fileEntryUpload = api.raw(
  { expose: true, auth: true, method: 'POST', path: '/file' },
  async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // TODO MIC check for authorization
    // read file from request
    const fileEntry: FileEntry = { userId, mimeType: '', type: FileEntryType.Generic, filename: '', data: [] };
    const bb = busboy({
      headers: request.headers,
      limits: { files: 1 },
    });
    // read file input stream
    bb.on('file', (_, file, info) => {
      fileEntry.filename = info.filename;
      fileEntry.mimeType = info.mimeType;
      file
        .on('data', (data) => {
          fileEntry.data!.push(data);
        })
        .on('close', () => {
          // end file upload
        })
        .on('error', (err) => {
          bb.emit('error', err);
        });
    });
    // read parameters
    bb.on('field', (fieldname, value) => {
      if (fieldname === 'id') {
        fileEntry.id = parseInt(value);
      }
      if (fieldname === 'userId') {
        fileEntry.userId = parseInt(value);
      }
      if (fieldname === 'type') {
        fileEntry.type = <FileEntryType>value;
      }
    });
    // end reading file input stream
    bb.on('close', async () => {
      try {
        // prepare file buffer
        const buf = Buffer.concat(fileEntry.data!);
        let id = 0;
        if (fileEntry.id) {
          // file already exixts, update existing one
          id = fileEntry.id;
          await orm('FileEntry')
            .update({
              userId: fileEntry.userId,
              type: fileEntry.type,
              mimeType: fileEntry.mimeType,
              filename: fileEntry.filename,
              data: buf,
            })
            .where('id', id);
        } else {
          // new file, insert new one
          const fileEntryRst = await orm('FileEntry').insert(
            {
              ...fileEntry,
              data: buf,
            },
            ['id']
          );
          // get file id
          id = fileEntryRst[0].id;
        }
        // prepare response
        const responseData: FileEntryUploadResponse = {
          id,
        };
        // Redirect to the root page
        response.end(JSON.stringify(responseData));
      } catch (err) {
        // file insert error
        bb.emit('error', err);
      }
    });
    // error
    bb.on('error', async (err) => {
      response.writeHead(500, { Connection: 'close' });
      response.end(`Error: ${(err as Error).message}`);
    });
    request.pipe(bb);
    return;
  }
); // fileEntryUpload

/**
 * Download file entry blob.
 */
export const fileEntryDownloadBlob = api.raw({ expose: true, method: 'GET', path: '/file/blob/:id/:token' }, async (request, response) => {
  try {
    // get request paramenters
    const { id, token } = (currentRequest() as APICallMeta).pathParams;
    // verify token
    // extract payload from token
    const { payload } = await jwtVerify<AuthenticationData>(token, new TextEncoder().encode(jwtSercretKey()));
    // load file entry
    const fileEntry = await orm<FileEntry>('FileEntry').first().where('id', id);
    if (!fileEntry) {
      // file not found
      response.writeHead(404);
      response.end('File not found');
      return;
    }
    // TODO MIC check for authorization
    // check authorization
    if (payload.userId !== fileEntry.userId || payload.fileId !== fileEntry.id) {
      // file not found
      response.writeHead(401);
      response.end('Invalid authorization');
      return;
    }
    // get file entry data
    const chunk = Buffer.from(fileEntry.data!);
    response.writeHead(200, { Connection: 'close' });
    response.end(chunk);
  } catch (err) {
    response.writeHead(500);
    response.end((err as Error).message);
  }
}); // fileEntryDownloadBlob
