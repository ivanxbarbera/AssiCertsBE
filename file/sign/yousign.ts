// libraries
import { APIError } from 'encore.dev/api';
import axios from 'axios';
// application libraries
import locz from '../../common/i18n';
import {
  YouSignDocumentUploadResponse,
  YouSignSignatureRequestResponse,
  YouSignSignDocumentRequest,
  YouSignSignDocumentResponse,
  YouSignSignerResponse,
} from './yousign.model';

export const youSignSignDocument = async (request: YouSignSignDocumentRequest): Promise<YouSignSignDocumentResponse> => {
  try {
    // TODO MIC convert into parameter
    const baseURL = 'https://api-sandbox.yousign.app/v3';
    const apiKey = 'r0Pbi4m8Ggqath8H8t8bkXWwK1U96v5Z';
    // create sign request
    // TODO MIC generate a random name using policy data ??
    const signatureRequestName = 'AssiDealer';
    const signRequestData = {
      delivery_mode: 'none',
      reminder_settings: {
        interval_in_days: 1,
        max_occurrences: 1,
      },
      timezone: request.signer.timeZone,
      signers_allowed_to_decline: false,
      name: signatureRequestName,
    };
    const signatureRequestConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
        'content-type': 'application/json',
      },
    };
    const signatureRequestUrl = `${baseURL}/signature_requests`;
    // call yousign api
    let apiResponse = await axios.post(signatureRequestUrl, signRequestData, signatureRequestConfig);
    if (apiResponse.status != 201) {
      // error creating sign request
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_SIGN_REQUEST_ERROR());
    }
    const signatureRequestResponse: YouSignSignatureRequestResponse = apiResponse.data;
    // upload document to be signed
    const documentUploadFormData = new FormData();
    documentUploadFormData.append('nature', 'signable_document');
    documentUploadFormData.append('parse_anchors', 'true');
    documentUploadFormData.append('file', request.documentStream, 'SignTest.pdf');
    const documentUploadConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
      },
    };
    const documentUploadUrl = `${baseURL}/signature_requests/${signatureRequestResponse.id}/documents`;
    // call yousign api
    apiResponse = await axios.post(documentUploadUrl, documentUploadFormData, documentUploadConfig);
    if (apiResponse.status != 201) {
      // error uploading document
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_DOCUMENT_UPLOAD_ERROR());
    }
    const documentUploadResponse: YouSignDocumentUploadResponse = apiResponse.data;
    // add a signer
    const signerData = {
      info: {
        locale: request.signer.locale,
        first_name: request.signer.firstName,
        last_name: request.signer.lastName,
        email: request.signer.email,
        phone_number: request.signer.phoneNumber,
      },
      signature_level: 'electronic_signature',
      signature_authentication_mode: request.signer.otpNotificationType,
    };
    const signerConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
        'content-type': 'application/json',
      },
    };
    const signerUrl = `${baseURL}/signature_requests/${signatureRequestResponse.id}/signers`;
    // call yousign api
    apiResponse = await axios.post(signerUrl, signerData, signerConfig);
    if (apiResponse.status != 201) {
      // error adding signer to request
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_SIGNER_ADD_ERROR());
    }
    const signerResponse: YouSignSignerResponse = apiResponse.data;
    // activate the signature request
    const activateSignatureData = {};
    const activateSignatureConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
      },
    };
    const activateSignatureUrl = `${baseURL}/signature_requests/${signatureRequestResponse.id}/activate`;
    // call yousign api
    apiResponse = await axios.post(activateSignatureUrl, activateSignatureData, activateSignatureConfig);
    if (apiResponse.status != 201) {
      // error adding signer to request
      throw APIError.internal(locz().FILE_SIGN_YOUSIGN_ACTIVATE_ERROR());
    }
    const activateSignatureResponse = apiResponse.data;
    // prepare response
    const response: YouSignSignDocumentResponse = {
      signatureRequestId: signatureRequestResponse.id,
    };
    // return response
    return response;
  } catch (error) {
    if (error instanceof APIError) {
      // error processing file
      throw error;
    }
    // error getting file
    throw APIError.internal(locz().FILE_SIGN_YOUSIGN_DOCUMENT_SIGN_ERROR());
  }
}; // youSignSignDocument
