import { UserRole } from '../user/user.model';

/**
 * Authorization visibility
 */
export enum AuthorizationVisibility {
  Visible = 'VISIBLE',
  Hidden = 'HIDDEN',
  Disabled = 'DISABLED',
} // AuthorizationVisibility

/**
 * Request for checking an operation authorization.
 * The requesting user ask to perform an operation on the destination user.
 */
export interface AuthorizationOperationUserCheck {
  // the code of the operation to perform
  operationCode: string;
  // id of the user that is performing the operation
  requestingUserId?: number;
  // role of the user that is performing the operation
  requestingUserRole?: UserRole;
  // id of the user on whom the operation is performed
  destinationUserIds?: number[];
  // role of the user on whom the operation is performed
  destinationUserRoles?: UserRole[];
} // AuthorizationOperationRoleCheck

/**
 * Authorization check response.
 */
export interface AuthorizationOperationResponse {
  // true if the operation can be performed, false otherwise
  canBePerformed: boolean;
} // AuthorizationOperationResponse

/**
 * Request for getting users authorized to perform an operation.
 */
export interface AuthorizationDestinationUserCheck {
  // the code of the operation to perform
  operationCode: string;
} // AuthorizationDestinationUserCheck

/**
 * Rsponse for getting users authorized to perform an operation.
 */
export interface AuthorizationDestinationUserCheckResponse {
  // the list of the allowed users
  userIds: number[];
} // AuthorizationDestinationUserCheckResponse

/**
 * Authorization list item.
 */
export interface AuthorizationList {
  // authorization name
  name: string;
  // authorization code
  code: string;
  // user role
  userRole: UserRole;
  // visibility
  visibility: AuthorizationVisibility;
} // AuthorizationList

/**
 * Authorization response for loaded values.
 */
export interface AuthorizationListResponse {
  // authorization list
  authorizations: AuthorizationList[];
} // AuthorizationListResponse
