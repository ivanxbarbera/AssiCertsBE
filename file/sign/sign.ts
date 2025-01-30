// libraries
import { api, APIError } from 'encore.dev/api';
import fs from 'fs';
// application modules
import { youSignDocumentSignStatus, youSignDocumentSign } from './yousign';
import { YouSignOtpNotificationType, YouSignDocumentSignRequest, YouSignDocumentStatusRequest, YouSignDocumentStatusResponse } from './yousign.model';
import { SignDocumentStatusRequest, SignDocumentStatusResponse } from './sign.model';
import locz from '../../common/i18n';

/**
 * Prepare a documento for signing.
 * Compelte all the steps necessary for signing a document.
 */
export const signDocumentPrepare = api(
  { expose: true, auth: false, method: 'POST', path: '/file/sign' },
  async (): Promise<SignDocumentStatusResponse> => {
    try {
      // call yousign document sign
      const stream = await new Response(fs.createReadStream('D:/Temp/00Svil/AssiDeal/test/SignTest.pdf')).blob();
      const signDocumentRequest: YouSignDocumentSignRequest = {
        documentStream: stream,
        signer: {
          firstName: 'Michele',
          lastName: 'Bonacina',
          email: 'michele.bonacina@ledinformatica.com',
          phoneNumber: '+393283699924',
          otpNotificationType: YouSignOtpNotificationType.EMail,
          locale: 'it',
          timeZone: 'Europe/Rome',
        },
      };
      // sign document using YouSign
      const signDocumentResponse: YouSignDocumentStatusResponse = await youSignDocumentSign(signDocumentRequest);
      // prepare response
      const response: SignDocumentStatusResponse = {
        requestId: signDocumentResponse.id,
        status: 'OK', // TODO MIC manage status code
      };
      // return response
      return response;
    } catch (error) {
      if (error instanceof APIError) {
        // error preparing document for sign
        throw error;
      }
      // error preparing document for sign
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_DOCUMENT_SIGN_ERROR());
    }
  }
); // signDocumentPrepare

/**
 * Prepare a documento for signing.
 * Compelte all the steps necessary for signing a document.
 */
export const signDocumentStatus = api(
  { expose: true, auth: false, method: 'GET', path: '/file/sign/:requestId' },
  async (request: SignDocumentStatusRequest): Promise<SignDocumentStatusResponse> => {
    try {
      // call yousign sign request status
      const youDocumentSignStatusRequest: YouSignDocumentStatusRequest = {
        id: request.requestId,
      };
      // sign document using YouSign
      const signDocumentStatusResponse: YouSignDocumentStatusResponse = await youSignDocumentSignStatus(youDocumentSignStatusRequest);
      // prepare response
      const response: SignDocumentStatusResponse = {
        requestId: signDocumentStatusResponse.id,
        status: 'OK', // TODO MIC manage status code
      };
      // return response
      return response;
    } catch (error) {
      if (error instanceof APIError) {
        // error preparing document for sign
        throw error;
      }
      // error preparing document for sign
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_DOCUMENT_SIGN_ERROR());
    }
  }
); // signDocumentPrepare
