// libraries
import { api, APIError } from 'encore.dev/api';
// application modules
import { Dealer, DealerEditRequest, DealerList, DealerListRequest, DealerListResponse, DealerRequest, DealerResponse } from './dealer.model';
import { orm } from '../common/db/db';
import { AuthorizationOperationResponse } from '../authorization/authorization.model';
import { authorizationOperationUserCheck } from '../authorization/authorization';
import { getAuthData } from '~encore/auth';
import locz from '../common/i18n';
import { DbUtility } from '../common/utility/db.utility';
import { AuthenticationData } from '../authentication/authentication.model';
import { AddressListResponse, EmailListResponse } from '../user/address/address.model';
import { addressDealerUpdate, addressListByDealer, emailDealerUpdate, emailListByDealer } from '../user/address/address';
import { GeneralUtility } from '../common/utility/general.utility';
import { UserResponse } from '../user/user.model';

/**
 * Search for dealers.
 * Apply filters and return a list of dealers.
 */
export const dealerList = api(
  { expose: true, auth: true, method: 'GET', path: '/dealer' },
  async (request: DealerListRequest): Promise<DealerListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'dealerList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load dealers
    const dealers = await orm<DealerList>('Dealer')
      .join('DealerEmail', 'DealerEmail.dealerId', 'Dealer.id')
      .join('Email', 'Email.id', 'DealerEmail.emailId')
      .leftOuterJoin('UserDealer', 'UserDealer.dealerId', 'Dealer.id')
      .select('Dealer.id as id', 'Dealer.companyName as companyName', 'Email.email as email', 'Dealer.vatNumber as vatNumber')
      .where((whereBuilder) => {
        whereBuilder.where('DealerEmail.default', true);
        if (request.userId) {
          // filter by user
          whereBuilder.where('UserDealer.userId', request.userId);
        }
      })
      .orderBy('Dealer.companyName');
    // return dealers
    return {
      dealers: DbUtility.removeNullFieldsList(dealers),
    };
  }
); // dealerList

/**
 * Load dealer details.
 */
export const dealerDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/dealer/:id' },
  async (request: DealerRequest): Promise<DealerResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'dealerList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load dealer
    const dealer = await orm<DealerResponse>('Dealer').first().where('id', request.id);
    if (!dealer) {
      // dealer not found
      throw APIError.notFound(locz().DEALER_DEALER_NOT_FOUND());
    }
    // load dealer emails
    const emailList: EmailListResponse = await emailListByDealer({ entityId: dealer.id });
    dealer.emails = emailList.emails;
    // load dealer addresses
    const addressList: AddressListResponse = await addressListByDealer({ entityId: dealer.id });
    dealer.addresses = addressList.addresses;
    // return dealer
    return DbUtility.removeNullFields(dealer);
  }
); // dealerDetail

/**
 * Insert new dealer.
 */
export const dealerInsert = api(
  { expose: true, auth: true, method: 'POST', path: '/dealer' },
  async (request: DealerEditRequest): Promise<DealerResponse> => {
    if (request.id) {
      // entity id not allowed in insert mode
      // TODO MIC extends to other insert
      throw APIError.permissionDenied(locz().COMMON_ID_NOT_ALLOWED_INSERT());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'dealerInsert',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // prepare new dealer
    // TODO MIC evaluate using filterObjectByInterface
    const newDealer: Dealer = {
      ...request,
    };
    // remove unnecessary fields
    delete (newDealer as any)['addresses'];
    delete (newDealer as any)['emails'];
    // insert dealer
    const dealerRst = await orm('Dealer').insert(newDealer).returning('id');
    const id = dealerRst[0].id;
    // insert emails
    const dealerEmails = request.emails;
    await emailDealerUpdate({ entityId: id, emails: dealerEmails });
    // insert addresses
    const dealerAddresses = request.addresses;
    await addressDealerUpdate({ entityId: id, addresses: dealerAddresses });
    // return created dealer
    return dealerDetail({ id });
  }
); // dealerInsert

/**
 * Update existing dealer.
 */
export const dealerUpdate = api(
  { expose: true, auth: true, method: 'PATCH', path: '/dealer/:id' },
  async (request: DealerEditRequest): Promise<DealerResponse> => {
    if (!request.id) {
      // entity id required in edit mode
      // TODO MIC extends to other edit
      throw APIError.permissionDenied(locz().COMMON_ID_REQUIRED_UPDATE());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'dealerUpdate',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // load dealer
    const dealer = await orm<Dealer>('Dealer').first().where('id', request.id);
    if (!dealer) {
      // dealer not found
      throw APIError.notFound(locz().DEALER_DEALER_NOT_FOUND());
    }
    // update dealer
    let updateDealer: Dealer = GeneralUtility.filterObjectByInterface(request, dealer, ['id']);
    const resutlQry = await orm('Dealer').where('id', request.id).update(updateDealer).returning('id');
    // update emails
    const dealerEmails = request.emails;
    await emailDealerUpdate({ entityId: request.id, emails: dealerEmails });
    // update addresses
    const dealerAddresses = request.addresses;
    await addressDealerUpdate({ entityId: request.id, addresses: dealerAddresses });
    // return updated dealer
    return dealerDetail({ id: resutlQry[0].id });
  }
); // dealerUpdate
