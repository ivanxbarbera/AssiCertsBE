// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { authorizationOperationUserCheck } from './../authorization/authorization';
import { AuthorizationOperationResponse } from './../authorization/authorization.model';
import {
  Certificate,
  CertificateEditRequest,
  CertificateRequest,
  CertificateResponse,
  FulfillmentType,
  PaymentFrequency,
  PaymentType,
  TransactionType,
} from './certificate.model';
import locz from '../common/i18n';
import { orm } from '../common/db/db';
import { addressCertificateUpdate, addressListByCertificate } from './../user/address/address';
import { AuthenticationData } from './../authentication/authentication.model';
import { AddressListResponse } from './../user/address/address.model';
import { DbUtility } from '../common/utility/db.utility';

/**
 * Load certificate details.
 */
export const certificateDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/certificate/:id' },
  async (request: CertificateRequest): Promise<CertificateResponse> => {
    // load certificate
    // TODO MIC check user visibility
    const certificate = await orm<CertificateResponse>('Certificate').first().where('id', request.id);
    if (!certificate) {
      // certificate not found
      throw APIError.notFound(locz().CERTIFICATE_CERTIFICATE_NOT_FOUND());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'certificateDetail',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load certificate address
    const addressList: AddressListResponse = await addressListByCertificate({ certificateId: certificate.id });
    if (addressList.addresses.length != 1) {
      // wrong number of addresses
      throw APIError.notFound(locz().CERTIFICATE_ADDRESS_WRONG__NUMBER());
    }
    certificate.customerAddress = addressList.addresses[0];
    // return certificate
    return DbUtility.removeNullFields(certificate);
  }
); // certificateDetail

/**
 * Insert new certificate.
 */
export const certificateInsert = api(
  { expose: true, auth: true, method: 'POST', path: '/certificate' },
  async (request: CertificateEditRequest): Promise<CertificateResponse> => {
    if (request.id) {
      // entity id not allowed in insert mode
      // TODO MIC extends to other insert
      throw APIError.permissionDenied(locz().COMMON_ID_NOT_ALLOWED_INSERT());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'certificateInsert',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // add internal fields
    // TODO MIC evaluate using filterObjectByInterface
    const newCertificate: Certificate = {
      ...request,
      userId,
      transactionType: TransactionType.NewEmission,
      clientNumber: 'TODO' + Date.now(),
      callerCode: 'TODO',
      dateOfCall: new Date(),
      policyNumber: 'TODO' + Date.now(),
      fulfillmentType: FulfillmentType.Email,
      paymentType: PaymentType.Borderaux,
      paymentFrequency: PaymentFrequency.OneTimeAdvance,
      mainInsuredProductCodeA: 'TODO',
      mainInsuredProductOptionA: 'TODO',
    };
    // remove unnecessary fields
    delete (newCertificate as any)['customerAddress'];
    // insert user
    const userRst = await orm('Certificate').insert(newCertificate).returning('id');
    const id = userRst[0].id;
    // insert addresses
    const certificateAddresses = request.customerAddress;
    await addressCertificateUpdate({ certificateId: id, addresses: [certificateAddresses] });
    // return created certificate
    return certificateDetail({ id });
  }
); // certificateInsert
