// libraries
import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
// application modules
import {
  AddressToponym,
  AddressToponymList,
  AddressToponymListResponse,
  EmailResponse,
  EmailType,
  EmailTypeList,
  EmailTypeListResponse,
  EmailTypeRequest,
  EmailTypeResponse,
  EmailUserListRequest,
  EmailListResponse,
  PhoneType,
  PhoneTypeList,
  PhoneTypeListResponse,
  EmailEditRequest,
  Email,
  AddressUserListRequest,
  AddressListResponse,
  AddressResponse,
  AddressToponymRequest,
  AddressToponymResponse,
  AddressTypeListResponse,
  AddressTypeList,
  AddressType,
  AddressTypeRequest,
  AddressTypeResponse,
  AddressEditRequest,
  Address,
} from './address.model';
import { AuthorizationOperationResponse } from '../../authorization/authorization.model';
import { authorizationOperationUserCheck } from '../../authorization/authorization';
import locz from '../../common/i18n';
import { orm } from '../../common/db/db';
import { DbUtility } from '../../common/utility/db.utility';
import { AuthenticationData } from '../../authentication/authentication.model';
import { UserAddress, UserEmail, UserResponse } from '../user.model';
import { UserCheckParameters } from '../../system/system.model';
import { systemParametersUserCheck } from '../../system/system';
import { municipalityDetail } from '../../archive/municipality/municipality';

/**
 * Address toponym list.
 * Load address toponym list.
 */
export const addressToponymList = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/addressToponym' },
  async (): Promise<AddressToponymListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'addressToponymList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load address toponym
    const addressToponyms: AddressToponymList[] = await orm<AddressToponym>('AddressToponym').select().orderBy('name', 'asc');
    return { addressToponyms: DbUtility.removeNullFieldsList(addressToponyms) };
  }
); // addressToponymList

/**
 * Load address toponym details.
 */
export const addressToponymDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/addressToponym/:id' },
  async (request: AddressToponymRequest): Promise<AddressToponymResponse> => {
    // load address toponym
    const addressToponym = await orm<AddressToponymResponse>('AddressToponym').first().where('id', request.id);
    if (!addressToponym) {
      // address toponym not found
      throw APIError.notFound(locz().USER_ADDRESS_TOPONYM_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'addressToponymDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // return email type
    return DbUtility.removeNullFields(addressToponym);
  }
); // addressToponymDetail

/**
 * Phone type list.
 * Load phone type list.
 */
export const phoneTypeList = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/phoneType' },
  async (): Promise<PhoneTypeListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'phoneTypeList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load phone types
    const phoneTypes: PhoneTypeList[] = await orm<PhoneType>('PhoneType').select().orderBy('name', 'asc');
    return { phoneTypes: DbUtility.removeNullFieldsList(phoneTypes) };
  }
); // phoneTypeList

/**
 * Email type list.
 * Load email type list.
 */
export const emailTypeList = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/emailType' },
  async (): Promise<EmailTypeListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'emailTypeList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load email types
    const emailTypes: EmailTypeList[] = await orm<EmailType>('EmailType').select().orderBy('name', 'asc');
    return { emailTypes: DbUtility.removeNullFieldsList(emailTypes) };
  }
); // emailTypeList

/**
 * Load email type details.
 */
export const emailTypeDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/emailType/:id' },
  async (request: EmailTypeRequest): Promise<EmailTypeResponse> => {
    // load email type
    const emailType = await orm<EmailTypeResponse>('EmailType').first().where('id', request.id);
    if (!emailType) {
      // email type not found
      throw APIError.notFound(locz().USER_ADDRESS_EMAILTYPE_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'emailTypeDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // return email type
    return DbUtility.removeNullFields(emailType);
  }
); // emailTypeDetail

/**
 * List email associated to a given user.
 */
export const emailListByUser = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/email/user/:userId' },
  async (request: EmailUserListRequest): Promise<EmailListResponse> => {
    // load requested user
    const requestedUser = await orm<UserResponse>('User').first().where('id', request.userId);
    if (!requestedUser) {
      // user not found
      throw APIError.notFound(locz().USER_USER_NOT_FOUND());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'emailListByUser',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
      requestingUserRole: authenticationData.userRole,
      destinationUserRoles: [requestedUser.role],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load user emails
    const emailsRst = await orm('Email')
      .join('UserEmail', 'UserEmail.emailId', 'Email.id')
      .where('UserEmail.userId', request.userId)
      .select(
        'Email.id as id',
        'Email.typeId as typeId',
        'Email.email as email',
        'UserEmail.default as default',
        'UserEmail.authentication as authentication'
      );
    const emails: EmailResponse[] = await Promise.all(
      emailsRst.map(async (email: any) => {
        const emailResponse: EmailResponse = {
          id: email.id,
          email: email.email,
          type: await emailTypeDetail({ id: email.typeId }),
          default: email.default,
          authentication: email.authentication,
        };
        return emailResponse;
      })
    );
    // return user email
    return { emails: DbUtility.removeNullFieldsList(emails) };
  }
); // emailListByUser

/**
 * Check emails consistency.
 * Receving the emails of a user or an address, execute this controls:
 * - exist one and only one default email
 * - exist one and only one authentication email
 * - the email domain must be one of the allowed ones (if configured)
 * - the email must be unique
 * @param emails email list to check
 * @return default email address
 */
export const emailUserCheck = api(
  { expose: false, auth: true, method: 'POST', path: '/user/address/email/user/check' },
  async (request: { emails: EmailEditRequest[] }): Promise<{ defaultEmail: string }> => {
    // get user check parameters
    const userCheckParameters: UserCheckParameters = await systemParametersUserCheck();
    //check email
    const userEmails = request.emails;
    let defaultEmailFounded: boolean = false;
    let defaultEmail: string = '';
    let authenticationEmailFounded: boolean = false;
    await Promise.all(
      userEmails.map(async (userEmail: EmailEditRequest) => {
        // check default email
        if (userEmail.default) {
          if (defaultEmailFounded) {
            // there are more than one default email
            throw APIError.alreadyExists(locz().USER_EMAIL_DEFAULT_EXIST());
          } else {
            defaultEmailFounded = true;
            defaultEmail = userEmail.email;
          }
        }
        // check authentication email
        if (userEmail.authentication) {
          if (authenticationEmailFounded) {
            // there are more than one authentication email
            throw APIError.alreadyExists(locz().USER_EMAIL_AUTHENTICATION_EXIST());
          } else {
            authenticationEmailFounded = true;
          }
        }
        // check for email existence in allowed domains
        if (userCheckParameters.allowedDomains.length > 0) {
          const emailDomain = userEmail.email.split('@')[1]; // Get the domain part of the email
          if (!userCheckParameters.allowedDomains.includes(emailDomain)) {
            throw APIError.invalidArgument(locz().USER_DOMAIN_NOT_ALLOWED());
          }
        }
        // check for mail existance
        const emailCount = (
          await orm('UserEmail')
            .join('Email', 'Email.id', 'UserEmail.emailId')
            .count('Email.id')
            .where((whereBuilder) => {
              whereBuilder.where('Email.email', userEmail.email);
              if (userEmail.id) {
                whereBuilder.andWhereNot('Email.id', userEmail.id);
              }
            })
        )[0]['count'] as number;
        if (emailCount > 0) {
          // email already exists
          throw APIError.alreadyExists(locz().USER_EMAIL_ALREADY_EXIST({ email: userEmail.email }));
        }
      })
    );
    // check default email
    if (!defaultEmailFounded) {
      // user must have a default email
      throw APIError.invalidArgument(locz().USER_EMAIL_DEFAULT_UNDEFINED());
    }
    // check authentication email
    if (!authenticationEmailFounded) {
      // user must have an authentication email
      throw APIError.invalidArgument(locz().USER_EMAIL_AUTHENTICATION_UNDEFINED());
    }
    // return default email address
    return { defaultEmail };
  }
); // emailUserCheck

/**
 * Update email of the given user
 * @param userId user unique identifies
 * @param email user email to update
 */
export const emailUserUpdate = api(
  { expose: false, auth: true, method: 'PATCH', path: '/user/address/email/user' },
  async (request: { userId: number; emails: EmailEditRequest[] }): Promise<void> => {
    // delete removed emails
    const emailAddresses: string[] = request.emails.map((email: EmailEditRequest) => {
      return email.email;
    });
    // load removed emails
    const deletedEmailIdRst = await orm<{ id: number }>('Email')
      .join('UserEmail', 'Email.id', 'UserEmail.emailId')
      .where('UserEmail.userId', request.userId)
      .whereNotIn('Email.email', emailAddresses)
      .select('Email.id as id');
    const deletedEmailIds: number[] = deletedEmailIdRst.map((item) => {
      return item.id;
    });
    if (deletedEmailIds.length > 0) {
      // delete user emails
      await orm('UserEmail').where('userId', request.userId).whereIn('emailId', deletedEmailIds).delete();
      // delete emails
      await orm('Email').whereIn('id', deletedEmailIds).delete();
    }
    // update emails
    const userEmails = request.emails;
    await Promise.all(
      userEmails.map(async (userEmail: EmailEditRequest) => {
        if (userEmail.id) {
          // email already exist
          // load email
          const emailRst = await orm('Email')
            .join('UserEmail', 'Email.id', 'UserEmail.emailId')
            .first('Email.id as emailId', 'UserEmail.id as userEmailId')
            .where('Email.id', userEmail.id)
            .andWhere('UserEmail.userId', request.userId);
          if (!emailRst) {
            // email does not exists
            throw APIError.notFound(locz().USER_EMAIL_NOT_FOUND({ id: userEmail.id }));
          }
          // update email
          await orm('Email').update({ email: userEmail.email, typeId: userEmail.type.id }).where('id', emailRst.emailId);
          // update user email association
          await orm('UserEmail').update({ default: userEmail.default, authentication: userEmail.authentication }).where('id', emailRst.userEmailId);
        } else {
          // email does not exists
          // insert email
          const newEmail: Email = {
            email: userEmail.email,
            typeId: userEmail.type.id,
          };
          const emailRst = await orm('Email').insert(newEmail).returning('id');
          const emailId = emailRst[0].id;
          // associate email to user
          const newUserEmail: UserEmail = {
            userId: request.userId,
            emailId: emailId,
            default: userEmail.default,
            authentication: userEmail.authentication,
          };
          await orm('UserEmail').insert(newUserEmail);
        }
      })
    );
  }
); // emailUserUpdate

/**
 * Update email of the given user
 * @param userId user unique identifies
 * @param email user email to update
 */
export const addressUserUpdate = api(
  { expose: false, auth: true, method: 'PATCH', path: '/user/address/address/user' },
  async (request: { userId: number; addresses: AddressEditRequest[] }): Promise<void> => {
    // delete removed addresses
    const addressIds: number[] = request.addresses
      .map((address: AddressEditRequest) => {
        return address.id ?? 0;
      })
      .filter((id: number) => {
        return id !== 0;
      });
    // load removed addresses
    const deletedAddressIdRst = await orm<{ id: number }>('Address')
      .join('UserAddress', 'Address.id', 'UserAddress.addressId')
      .where('UserAddress.userId', request.userId)
      .whereNotIn('Address.id', addressIds)
      .select('Address.id as id');
    const deletedAddressIds: number[] = deletedAddressIdRst.map((item) => {
      return item.id;
    });
    if (deletedAddressIds.length > 0) {
      // delete user address
      await orm('UserAddress').where('userId', request.userId).whereIn('addressId', deletedAddressIds).delete();
      // delete addresses
      await orm('Address').whereIn('id', deletedAddressIds).delete();
    }
    // update addresses
    const userAddresses = request.addresses;
    await Promise.all(
      userAddresses.map(async (userAddress: AddressEditRequest) => {
        if (userAddress.id) {
          // address already exist
          // load address
          const addressRst = await orm('Address')
            .join('UserAddress', 'Address.id', 'UserAddress.addressId')
            .first('Address.id as addressId', 'UserAddress.id as userAddressId')
            .where('Address.id', userAddress.id)
            .andWhere('UserAddress.userId', request.userId);
          if (!addressRst) {
            // address does not exists
            throw APIError.notFound(locz().USER_ADDRESS_NOT_FOUND({ id: userAddress.id }));
          }
          // update address
          await orm('Address')
            .update({
              address: userAddress.address,
              houseNumber: userAddress.houseNumber,
              postalCode: userAddress.postalCode,
              typeId: userAddress.type.id,
              toponymId: userAddress.toponym.id,
              municipalityId: userAddress.municipality.id,
            })
            .where('id', addressRst.addressId);
        } else {
          // address does not exists
          // insert address
          const newAddress: Address = {
            address: userAddress.address,
            houseNumber: userAddress.houseNumber,
            postalCode: userAddress.postalCode,
            typeId: userAddress.type.id,
            toponymId: userAddress.toponym.id,
            municipalityId: userAddress.municipality.id!,
          };
          const addressRst = await orm('Address').insert(newAddress).returning('id');
          const addressId = addressRst[0].id;
          // associate address to user
          const newUserAddress: UserAddress = {
            userId: request.userId,
            addressId: addressId,
          };
          await orm('UserAddress').insert(newUserAddress);
        }
      })
    );
  }
); // addressUserUpdate

/**
 * List address associated to a given user.
 */
export const addressListByUser = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/address/user/:userId' },
  async (request: AddressUserListRequest): Promise<AddressListResponse> => {
    // load requested user
    const requestedUser = await orm<UserResponse>('User').first().where('id', request.userId);
    if (!requestedUser) {
      // user not found
      throw APIError.notFound(locz().USER_USER_NOT_FOUND());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'addressListByUser',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
      requestingUserRole: authenticationData.userRole,
      destinationUserRoles: [requestedUser.role],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load user addresses
    const addressRst = await orm('Address')
      .join('UserAddress', 'UserAddress.addressId', 'Address.id')
      .where('UserAddress.userId', request.userId)
      .select(
        'Address.id as id',
        'Address.typeId as typeId',
        'Address.toponymId as toponymId',
        'Address.address as address',
        'Address.houseNumber as houseNumber',
        'Address.postalCode as postalCode',
        'Address.municipalityId as municipalityId'
      );
    const addresses: AddressResponse[] = await Promise.all(
      addressRst.map(async (address: any) => {
        const addressList: AddressResponse = {
          id: address.id,
          type: await addressTypeDetail({ id: address.typeId }),
          toponym: await addressToponymDetail({ id: address.toponymId }),
          address: address.address,
          houseNumber: address.houseNumber,
          postalCode: address.postalCode,
          municipality: await municipalityDetail({ id: address.municipalityId }),
        };
        return addressList;
      })
    );
    // return user email
    return { addresses: DbUtility.removeNullFieldsList(addresses) };
  }
); // emailListByUser

/**
 * Address type list.
 * Load address type list.
 */
export const addressTypeList = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/addressType' },
  async (): Promise<AddressTypeListResponse> => {
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'addressTypeList',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get data
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load address types
    const addressTypes: AddressTypeList[] = await orm<AddressType>('AddressType').select().orderBy('name', 'asc');
    return { addressTypes: DbUtility.removeNullFieldsList(addressTypes) };
  }
); // addressTypeList

/**
 * Load address type details.
 */
export const addressTypeDetail = api(
  { expose: true, auth: true, method: 'GET', path: '/user/address/addressType/:id' },
  async (request: AddressTypeRequest): Promise<AddressTypeResponse> => {
    // load address type
    const addressType = await orm<AddressTypeResponse>('AddressType').first().where('id', request.id);
    if (!addressType) {
      // address type not found
      throw APIError.notFound(locz().USER_ADDRESS_ADDRESSTYPE_NOT_FOUND());
    }
    // check authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'addressTypeDetail',
      requestingUserRole: getAuthData()?.userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().USER_USER_NOT_ALLOWED());
    }
    // return address type
    return DbUtility.removeNullFields(addressType);
  }
); // addressTypeDetail
