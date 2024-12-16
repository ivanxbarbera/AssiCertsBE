import { api } from 'encore.dev/api';
import { AuthorizationOperationResponse, AuthorizationOperationUserCheck } from './authorization.model';
import { UserRole } from '../user/user.model';

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
    (request.operationCode == 'systemParameterList' || request.operationCode == 'systemParameterUpdate') &&
    request.requestingUserRole &&
    request.requestingUserRole == UserRole.SuperAdministrator // superadmin can access system parameters
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
