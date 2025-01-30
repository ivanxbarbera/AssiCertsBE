// libraries
import { api } from 'encore.dev/api';
import fs from 'fs';
import { Readable } from 'stream';
// application modules
import { youSignSignDocument } from './yousign';
import { YouSignOtpNotificationType, YouSignSignDocumentRequest } from './yousign.model';
import { SignDocumentResponse } from './sign.model';

export const signDocument = api({ expose: true, auth: false, method: 'POST', path: '/file/sign' }, async (request): Promise<SignDocumentResponse> => {
  // call yousign document sign
  const stream = await new Response(fs.createReadStream('D:/Temp/00Svil/AssiDeal/test/SignTest.pdf')).blob();
  const signDocumentRequest: YouSignSignDocumentRequest = {
    documentStream: stream,
    signer: {
      firstName: 'Michele',
      lastName: 'Bonacina',
      email: 'michele.bonacina@ledinformatica.com',
      phoneNumber: '+393283699924',
      otpNotificationType: YouSignOtpNotificationType.EMail,
    },
  };
  try {
    const signDocumentResponse = youSignSignDocument(signDocumentRequest);
    return { status: 'OK' };
  } catch (error) {
    return { status: 'KO' };
  }
}); // signDocument
