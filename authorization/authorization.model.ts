import { UserRole } from '../user/user.model';

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
