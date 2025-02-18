// libraries
import { api, APIError } from 'encore.dev/api';
// application modules
import {
  AuthorizationDestinationUserCheck,
  AuthorizationDestinationUserCheckResponse,
  AuthorizationList,
  AuthorizationListResponse,
  AuthorizationOperationResponse,
  AuthorizationOperationUserCheck,
  AuthorizationVisibility,
} from './authorization.model';
import { UserRole } from '../user/user.model';
import { orm } from '../common/db/db';
import locz from '../common/i18n';
import { getAuthData } from '~encore/auth';
import { DbUtility } from '../common/utility/db.utility';
import { getUserRoleWeight } from '../user/user';

// TODO MIC !!this is a temporary solution!!

/**
 * Check if a user can perform an operation on another user.
 * Based on user identifier.
 * @param reques authorization request
 * @return authorization check response
 */
export const authorizationOperationUserCheck = (request: AuthorizationOperationUserCheck): AuthorizationOperationResponse => {
  // TODO MIC move checks to database
  // check cases
  // operations on user allowed to only to user that made the request (requesting user == requested user)
  if (
    (request.operationCode == 'loginRenewBearer' ||
      request.operationCode == 'loginRenewCookie' ||
      request.operationCode == 'userPasswordChange' ||
      request.operationCode == 'userPasswordHistoryCheck' ||
      request.operationCode == 'userPasswordExpirationCheck' ||
      request.operationCode == 'resendNotificationMessageList' ||
      request.operationCode == 'notificationMessageList' ||
      request.operationCode == 'notificationMessageAllRead' ||
      request.operationCode == 'notificationMessageRead' ||
      request.operationCode == 'notificationMessageUnread' ||
      request.operationCode == 'notificationMessageDetails' ||
      request.operationCode == 'notificationMessageDetailsFull' ||
      request.operationCode == 'userDetail' ||
      request.operationCode == 'emailListByUser' ||
      request.operationCode == 'addressListByUser' ||
      request.operationCode == 'userSiteLock' ||
      request.operationCode == 'userSiteUnlock' ||
      request.operationCode == 'userStatusGet' ||
      request.operationCode == 'userProfileGet' ||
      request.operationCode == 'userProfileUpdate') &&
    request.requestingUserId &&
    request.requestingUserId > 0 &&
    request.destinationUserIds &&
    request.destinationUserIds.length == 1 &&
    request.requestingUserId === request.destinationUserIds[0]
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
  // operations on user allowed to user hierarchy
  if (
    (request.operationCode == 'userList' ||
      request.operationCode == 'emailListByUser' ||
      request.operationCode == 'addressListByUser' ||
      request.operationCode == 'userDetail' ||
      request.operationCode == 'userInsert' ||
      request.operationCode == 'userUpdate') &&
    request.requestingUserRole &&
    request.destinationUserRoles &&
    (request.requestingUserRole == UserRole.SuperAdministrator || // superadmin can access all users
      (request.requestingUserRole == UserRole.Administrator &&
        request.destinationUserRoles.filter((role: UserRole) => role == UserRole.Member).length == request.destinationUserRoles.length)) // admin can access only members
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
  // operation allowed only to superadmin
  if (
    (request.operationCode == 'systemParameterList' ||
      request.operationCode == 'systemParameterUpdate' ||
      request.operationCode == 'phoneTypeList' ||
      request.operationCode == 'addressToponymList' ||
      request.operationCode == 'nationList' ||
      request.operationCode == 'regionList' ||
      request.operationCode == 'provinceList' ||
      request.operationCode == 'municipalityList' ||
      request.operationCode == 'municipalityCompleteList') &&
    request.requestingUserRole &&
    request.requestingUserRole == UserRole.SuperAdministrator // superadmin can access system functionality
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
  // operation allowed to superadmin and admin
  if (
    (request.operationCode == 'dealerList' ||
      request.operationCode == 'dealerDetail' ||
      request.operationCode == 'dealerInsert' ||
      request.operationCode == 'dealerUpdate' ||
      request.operationCode == 'emailListByDealer' ||
      request.operationCode == 'addressListByDealer') &&
    request.requestingUserRole &&
    (request.requestingUserRole == UserRole.SuperAdministrator || request.requestingUserRole == UserRole.Administrator) // superadmin and admin can access
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
  // operation for all
  if (
    (request.operationCode == 'authorizationList' ||
      request.operationCode == 'emailTypeList' ||
      request.operationCode == 'emailTypeDetail' ||
      request.operationCode == 'addressToponymDetail' ||
      request.operationCode == 'addressTypeList' ||
      request.operationCode == 'addressTypeDetail' ||
      request.operationCode == 'nationDetail' ||
      request.operationCode == 'regionDetail' ||
      request.operationCode == 'provinceDetail' ||
      request.operationCode == 'municipalityDetail' ||
      request.operationCode == 'addressListByCertificate' ||
      request.operationCode == 'certificateList' ||
      request.operationCode == 'certificateDetail' ||
      request.operationCode == 'certificateUpdate' ||
      request.operationCode == 'certificateInsert' ||
      request.operationCode == 'customerList' ||
      request.operationCode == 'customerDetail' ||
      request.operationCode == 'customerUpdate' ||
      request.operationCode == 'customerInsert' ||
      request.operationCode == 'emailListByCustomer' ||
      request.operationCode == 'addressListByCustomer') &&
    request.requestingUserRole
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
  // not authorized
  return {
    canBePerformed: false,
  };
}; // authorizationOperationRoleCheck

/**
 * Return the list of users that can perform requested operation.
 * @param request authorization request
 * @returns authorized users list
 */
export const authorizationDestinationUserCheck = async (
  request: AuthorizationDestinationUserCheck
): Promise<AuthorizationDestinationUserCheckResponse> => {
  // TODO MIC move checks to database
  if (request.operationCode == 'userRegisterActivate') {
    // load users authorized to activate new registered users
    // only superadmin can activate users
    const users = await orm<{ id: number }>('User').select('id').where('role', UserRole.SuperAdministrator).andWhere('disabled', false);
    const userIds: number[] = users.map((user) => {
      return user.id;
    });
    return {
      userIds,
    };
  }
  // no user authorized
  return {
    userIds: [],
  };
}; // authorizationDestinationUserList

/**
 * Authorization list.
 * Load user authorization list.
 */
export const authorizationList = api(
  { expose: true, auth: true, method: 'GET', path: '/authorization' },
  async (): Promise<AuthorizationListResponse> => {
    // check authorization
    const userRole: UserRole = getAuthData()?.userRole!;
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'authorizationList',
      requestingUserRole: userRole,
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get details
      throw APIError.permissionDenied(locz().SYSTEM_USER_NOT_ALLOWED());
    }
    // load authorizations
    // TODO MIC move checks to database

    const authorizations: AuthorizationList[] = [
      { name: 'Main Area', code: 'main', userRole: UserRole.Member, visibility: AuthorizationVisibility.Hidden },
      { name: 'Dashboard', code: 'dashboard', userRole: UserRole.Member, visibility: AuthorizationVisibility.Hidden },
      { name: 'Notifications', code: 'notification', userRole: UserRole.Member, visibility: AuthorizationVisibility.Hidden },
      { name: 'Cerificate Area', code: 'certificate', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'New certificate', code: 'certificate.new', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'Certificate list', code: 'certificate.list', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'Archive Area', code: 'archive', userRole: UserRole.Administrator, visibility: AuthorizationVisibility.Visible },
      {
        name: 'Address toponym',
        code: 'archive.address-toponym',
        userRole: UserRole.SuperAdministrator,
        visibility: AuthorizationVisibility.Visible,
      },
      { name: 'Municipality', code: 'archive.municipality', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
      { name: 'Dealer', code: 'archive.dealer', userRole: UserRole.Administrator, visibility: AuthorizationVisibility.Visible },
      { name: 'User', code: 'archive.user', userRole: UserRole.Administrator, visibility: AuthorizationVisibility.Visible },
      { name: 'Administration Area', code: 'administration', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
      { name: 'System', code: 'system', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
      { name: 'Parameters', code: 'system.parameter', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
    ];
    // load user
    // filter by user role
    const authorized = authorizations.filter((authorization: AuthorizationList) => {
      return isAuthorizationAccessible(authorization, userRole);
    });
    return { authorizations: DbUtility.removeNullFieldsList(authorized) };
  }
); // authorizationList

/**
 * Check if the user givem user can access requested authorization.
 * @param authorization authorization requested
 * @param userRole role of the requesting user
 * @returns true if user can accesso authorization, false otherwise
 */
const isAuthorizationAccessible = (authorization: AuthorizationList, userRole: UserRole) => {
  return getUserRoleWeight(userRole) >= getUserRoleWeight(authorization.userRole);
}; // isAuthorizationAccessible
