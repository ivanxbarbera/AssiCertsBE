// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import { Customer, CustomerList, CustomerListResponse, CustomerRequest, CustomerResponse, CustomerEditRequest, CustomerUser } from './customer.model';
import { orm } from '../common/db/db';
import { AuthenticationData } from '../authentication/authentication.model';
import locz from '../common/i18n';
import { DbUtility } from '../common/utility/db.utility';
import { GeneralUtility } from '../common/utility/general.utility';
import { EmailListResponse, AddressListResponse, PhoneListResponse } from '../user/address/address.model';
import { AuthorizationOperationResponse } from '../authorization/authorization.model';
import { authorizationOperationUserCheck } from '../authorization/authorization';
import {
  addressCustomerUpdate,
  addressListByCustomer,
  addressUserUpdate,
  emailCustomerUpdate,
  emailListByCustomer,
  emailUserUpdate,
  phoneCustomerUpdate,
  phoneListByCustomer,
} from '../user/address/address';
import { UserRole } from '../user/user.model';

/**
 * Search for customers.
 * Apply filters and return a list of customers.
 */
export const customerList = api({ expose: true, auth: true, method: 'GET', path: '/customer' }, async (): Promise<CustomerListResponse> => {
  // get authentication data
  const authenticationData: AuthenticationData = getAuthData()!;
  const userId = parseInt(authenticationData.userID);
  // check authorization
  const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
    operationCode: 'customerList',
    requestingUserRole: authenticationData.userRole,
  });
  if (!authorizationCheck.canBePerformed) {
    // user not allowed to get details
    throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
  }
  // load customers
  const customersQry = orm<CustomerList>('Customer')
    .join('CustomerEmail', 'CustomerEmail.customerId', 'Customer.id')
    .join('Email', 'Email.id', 'CustomerEmail.emailId')
    .where('CustomerEmail.default', true);
  if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
    customersQry
      .join('CustomerUser', 'CustomerUser.customerId', 'Customer.id')
      .join('UserDealer', 'UserDealer.userId', 'CustomerUser.userId')
      .where('UserDealer.dealerId', authenticationData.dealerId);
  }
  const customers = await customersQry
    .select(
      'Customer.id as id',
      'Customer.firstName as firstName',
      'Customer.lastName as lastName',
      'Customer.fiscalCode as fiscalCode',
      'Email.email as email'
    )
    .orderBy('Customer.lastName')
    .orderBy('Customer.firstName');
  // return customers
  return {
    customers: DbUtility.removeNullFieldsList(customers),
  };
}); // customerList

/**
 * Load customer details.
 */
export const customerDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/customer/:id' },
  async (request: CustomerRequest): Promise<CustomerResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'customerDetail',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load customer
    const customerQry = orm<CustomerResponse>('Customer').where('Customer.id', request.id);
    if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
      customerQry
        .join('CustomerUser', 'CustomerUser.customerId', 'Customer.id')
        .join('UserDealer', 'UserDealer.userId', 'CustomerUser.userId')
        .where('UserDealer.dealerId', authenticationData.dealerId);
    }
    const customer = await customerQry.first(
      'Customer.id as id',
      'Customer.firstName as firstName',
      'Customer.middleName as middleName',
      'Customer.lastName as lastName',
      'Customer.fiscalCode as fiscalCode',
      'Customer.dateOfBirth as dateOfBirth'
    );
    if (!customer) {
      // customer not found
      throw APIError.notFound(locz().CUSTOMER_CUSTOMER_NOT_FOUND());
    }
    // load customer emails
    const emailList: EmailListResponse = await emailListByCustomer({ entityId: customer.id });
    customer.emails = emailList.emails;
    // load customer addresses
    const addressList: AddressListResponse = await addressListByCustomer({ entityId: customer.id });
    customer.addresses = addressList.addresses;
    // load customer phones
    const phonesList: PhoneListResponse = await phoneListByCustomer({ entityId: customer.id });
    customer.phones = phonesList.phones;
    // return customer
    return DbUtility.removeNullFields(customer);
  }
); // customerDetail

/**
 * Insert new customer.
 */
export const customerInsert = api(
  { expose: true, auth: true, method: 'POST', path: '/customer' },
  async (request: CustomerEditRequest): Promise<CustomerResponse> => {
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
      operationCode: 'customerInsert',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // add internal fields
    // TODO MIC evaluate using filterObjectByInterface
    const newCustomer: Customer = {
      ...request,
    };
    // remove unnecessary fields
    delete (newCustomer as any)['addresses'];
    delete (newCustomer as any)['emails'];
    delete (newCustomer as any)['phones'];
    // insert customer
    const customerRst = await orm('Customer').insert(newCustomer).returning('id');
    const id = customerRst[0].id;
    // associate customer to user
    const newCustomerUser: CustomerUser = {
      customerId: id,
      userId,
    };
    await orm('CustomerUser').insert(newCustomerUser);
    // insert emails
    const customerEmails = request.emails;
    await emailCustomerUpdate({ entityId: id, emails: customerEmails });
    // insert addresses
    const customerAddresses = request.addresses;
    await addressCustomerUpdate({ entityId: id, addresses: customerAddresses });
    // insert phones
    const customerPhones = request.phones;
    await phoneCustomerUpdate({ entityId: id, phones: customerPhones });
    // return created customer
    return customerDetail({ id });
  }
); // customerInsert

/**
 * Update existing customer.
 */
export const customerUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/customer/:id' },
  async (request: CustomerEditRequest): Promise<CustomerResponse> => {
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
      operationCode: 'customerUpdate',
      requestingUserRole: authenticationData.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // customer not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load customer
    const customerQry = orm<Customer>('Customer').where('id', request.id);
    if (authenticationData.userRole !== UserRole.Administrator && authenticationData.userRole !== UserRole.SuperAdministrator) {
      customerQry
        .join('CustomerUser', 'CustomerUser.customerId', 'Customer.id')
        .join('UserDealer', 'UserDealer.userId', 'CustomerUser.userId')
        .where('UserDealer.dealerId', authenticationData.dealerId);
    }
    const customer = await customerQry.first();
    if (!customer) {
      // customer not found
      throw APIError.notFound(locz().CUSTOMER_CUSTOMER_NOT_FOUND());
    }
    // update customer
    let updateCustomer: Customer = GeneralUtility.filterObjectByInterface(request, customer, ['id']);
    const resutlQry = await orm('Customer').where('id', request.id).update(updateCustomer).returning('id');
    // load customer-user association
    const customerUser = await orm<Customer>('CustomerUser').where('customerId', request.id).select('id');
    if (customerUser.length != 1) {
      // wrong custmer user association
      throw APIError.unavailable(locz().USER_DEALER_TOO_MANY());
    }
    // update customer user association
    await orm('CustomerUser').update({ userId: userId }).where('id', customerUser[0].id);
    // update emails
    const customerEmails = request.emails;
    await emailCustomerUpdate({ entityId: request.id, emails: customerEmails });
    // update addresses
    const customerAddresses = request.addresses;
    await addressCustomerUpdate({ entityId: request.id, addresses: customerAddresses });
    // update phones
    const customerPhones = request.phones;
    await phoneCustomerUpdate({ entityId: request.id, phones: customerPhones });
    // return updated customer
    return customerDetail({ id: resutlQry[0].id });
  }
); // customerUpdate
