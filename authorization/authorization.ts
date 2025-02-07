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
  if (
    (request.operationCode == 'systemParameterList' ||
      request.operationCode == 'systemParameterUpdate' ||
      request.operationCode == 'phoneTypeList' ||
      request.operationCode == 'addressToponymList' ||
      request.operationCode == 'municipalityList') &&
    request.requestingUserRole &&
    request.requestingUserRole == UserRole.SuperAdministrator // superadmin can access system functionality
  ) {
    return {
      // authorized
      canBePerformed: true,
    };
  }
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
      request.operationCode == 'municipalityDetail') &&
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
      { name: 'Dashboard', code: 'dashboard', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'Notifications', code: 'notification', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'Production', code: 'production', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Administration', code: 'administration', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Portfolio Analisys', code: 'portfolio-analysis', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      {
        name: 'Fiscal Year Premiums',
        code: 'portfolio-analysis.fiscal-year-premium',
        userRole: UserRole.Member,
        visibility: AuthorizationVisibility.Disabled,
      },
      {
        name: 'Underwriting Year Premiums',
        code: 'portfolio-analysis.underwriting-year-premium',
        userRole: UserRole.Member,
        visibility: AuthorizationVisibility.Disabled,
      },
      { name: 'Triangular', code: 'portfolio-analysis.triangular', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Tableu de Bord', code: 'portfolio-analysis.tableu-de-bord', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      {
        name: 'Series Comparisons',
        code: 'portfolio-analysis.series-comparison',
        userRole: UserRole.Member,
        visibility: AuthorizationVisibility.Disabled,
      },
      { name: 'Ranking', code: 'portfolio-analysis.ranking', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Companies', code: 'portfolio-analysis.company', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Marketing', code: 'marketing', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Archive', code: 'archive', userRole: UserRole.Member, visibility: AuthorizationVisibility.Visible },
      { name: 'Registry', code: 'archive.registry', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Personal data', code: 'archive.personal-data', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Contacts', code: 'archive.contacts', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      {
        name: 'Personal Data Import',
        code: 'archive.personal-data-import',
        userRole: UserRole.Member,
        visibility: AuthorizationVisibility.Disabled,
      },
      { name: 'Address toponym', code: 'user.address-toponym', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
      { name: 'Municipality', code: 'archive.municipality', userRole: UserRole.SuperAdministrator, visibility: AuthorizationVisibility.Visible },
      { name: 'Claim Office', code: 'claim-office', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Documents Sign', code: 'document-sign', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'Power BI', code: 'power-bi', userRole: UserRole.Member, visibility: AuthorizationVisibility.Disabled },
      { name: 'User', code: 'user', userRole: UserRole.Administrator, visibility: AuthorizationVisibility.Visible },
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
