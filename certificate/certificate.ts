// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { authorizationOperationUserCheck } from './../authorization/authorization';
import { AuthorizationOperationResponse } from './../authorization/authorization.model';
import {
  Certificate,
  CertificateCustomer,
  CertificateEditRequest,
  CertificateList,
  CertificateListResponse,
  CertificateRequest,
  CertificateResponse,
  FulfillmentType,
  PaymentFrequency,
  PaymentType,
  TransactionType,
} from './certificate.model';
import locz from '../common/i18n';
import { orm } from '../common/db/db';
import { AuthenticationData } from './../authentication/authentication.model';
import { DbUtility } from '../common/utility/db.utility';
import { GeneralUtility } from '../common/utility/general.utility';
import { CustomerResponse } from '../customer/customer.model';
import { customerDetail } from '../customer/customer';
import { UserRole } from '../user/user.model';

/**
 * Search for certificates.
 * Apply filters and return a list of certificates.
 */
export const certificateList = api({ expose: true, auth: true, method: 'GET', path: '/certificate' }, async (): Promise<CertificateListResponse> => {
  // get authentication data
  const authenticationData: AuthenticationData = getAuthData()!;
  // check authorization
  const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
    operationCode: 'certificateList',
    requestingUserRole: authenticationData.userRole,
  });
  if (!authorizationCheck.canBePerformed) {
    // user not allowed to get details
    throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
  }
  // load certificates
  const certificatesQry = orm<CertificateList>('Certificate')
    .join('CertificateCustomer', 'CertificateCustomer.certificateId', 'Certificate.id')
    .join('Customer', 'Customer.id', 'CertificateCustomer.customerId');
  if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
    certificatesQry.join('UserDealer', 'UserDealer.userId', 'Certificate.userId').where('UserDealer.dealerId', authenticationData.dealerId);
  }
  const certificates = await certificatesQry
    .select(
      'Certificate.id as id',
      'Certificate.clientNumber as clientNumber',
      'Certificate.effectiveDate as effectiveDate',
      'Certificate.carPlateNumber as carPlateNumber',
      'Certificate.carModel as carModel',
      'Customer.firstName as customerFirstName',
      'Customer.lastName as customerLastName'
    )
    .orderBy('clientNumber');
  // return certificates
  return {
    certificates: DbUtility.removeNullFieldsList(certificates),
  };
}); // certificateList

/**
 * Load certificate details.
 */
export const certificateDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/certificate/:id' },
  async (request: CertificateRequest): Promise<CertificateResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'certificateDetail',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load certificate
    const certificateQry = orm<CertificateResponse>('Certificate')
      .join('CertificateCustomer', 'CertificateCustomer.certificateId', 'Certificate.id')
      .join('Customer', 'Customer.id', 'CertificateCustomer.customerId')
      .where('Certificate.id', request.id);
    if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
      certificateQry.join('UserDealer', 'UserDealer.userId', 'Certificate.userId').where('UserDealer.dealerId', authenticationData.dealerId);
    }
    const certificate = await certificateQry.first(
      'Certificate.id as id',
      'Certificate.cancellationType as cancellationType',
      'Certificate.clientNumber as clientNumber',
      'Certificate.callerCode as callerCode',
      'Certificate.effectiveDate as effectiveDate',
      'Certificate.policyNumber as policyNumber',
      'Certificate.mainInsuredProductCodeA as mainInsuredProductCodeA',
      'Certificate.mainInsuredProductOptionA as mainInsuredProductOptionA',
      'Certificate.carPlateNumber as carPlateNumber',
      'Certificate.carChassisNumber as carChassisNumber',
      'Certificate.carModel as carModel',
      'Certificate.policyDurationInMonth as policyDurationInMonth',
      'Certificate.customerOriginal as customerOriginal',
      'CertificateCustomer.customerId as customerId'
    );
    if (!certificate) {
      // certificate not found
      throw APIError.notFound(locz().CERTIFICATE_CERTIFICATE_NOT_FOUND());
    }
    // load customer
    if (certificate.customerOriginal) {
      // original customer json was saved
      certificate.customer = certificate.customerOriginal;
    } else {
      const customer: CustomerResponse = await customerDetail({ id: certificate.customerId });
      certificate.customer = customer;
    }
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
    // load selected customer
    const customer = await customerDetail({ id: request.customerId });
    if (!customer) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().CERTIFICATE_CUSTOMER_NOT_FOUND());
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
      policyDurationInMonth: 36,
    };
    // remove unnecessary fields
    delete (newCertificate as any)['customerId'];
    // insert certificate
    const certificateRst = await orm('Certificate').insert(newCertificate).returning('id');
    const id = certificateRst[0].id;
    // insert certificate customer
    const newCertificateCustomer: CertificateCustomer = {
      certificateId: id,
      customerId: customer.id,
    };
    await orm('CertificateCustomer').insert(newCertificateCustomer);
    // return created certificate
    return certificateDetail({ id });
  }
); // certificateInsert

/**
 * Update existing certificate.
 */
export const certificateUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/certificate/:id' },
  async (request: CertificateEditRequest): Promise<CertificateResponse> => {
    if (!request.id) {
      // entity id required in edit mode
      // TODO MIC extends to other edit
      throw APIError.permissionDenied(locz().COMMON_ID_REQUIRED_UPDATE());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'certificateUpdate',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load selected customer
    const customer = await customerDetail({ id: request.customerId });
    if (!customer) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().CERTIFICATE_CUSTOMER_NOT_FOUND());
    }
    // load certificate
    const certificateQry = orm<Certificate>('Certificate').where('Certificate.id', request.id);
    if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
      certificateQry.join('UserDealer', 'UserDealer.userId', 'Certificate.userId').where('UserDealer.dealerId', authenticationData.dealerId);
    }
    const certificate = await certificateQry.first();
    if (!certificate) {
      // certificate not found
      throw APIError.notFound(locz().CERTIFICATE_CERTIFICATE_NOT_FOUND());
    }
    // prepare certificate data
    certificate.userId = userId;
    // update certificate
    let updateCertificate: Certificate = GeneralUtility.filterObjectByInterface(request, certificate, ['id']);
    const resutlQry = await orm('Certificate').where('id', request.id).update(updateCertificate).returning('id');
    // load certificate
    const certificateCustomers = await orm<CertificateCustomer>('CertificateCustomer').where('certificateId', request.id).select();
    if (certificateCustomers.length != 1) {
      // wrong certificate customer number
      throw APIError.notFound(locz().CERTIFICATE_CUSTOMER_WRONG_NUMBER());
    }
    // update certificate customer
    const certificateCustomer = certificateCustomers[0];
    await orm('CertificateCustomer').where('id', certificateCustomer.id).update({ customerId: customer.id });
    // return updated certificate
    return certificateDetail({ id: resutlQry[0].id });
  }
); // certificateUpdate
