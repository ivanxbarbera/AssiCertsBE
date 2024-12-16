// libraries
import { Header } from 'encore.dev/api';
// application modules
import { UserRole } from '../user/user.model';

/**
 * Data received for authentication verify using Bearer
 */
export interface AuthenticationParams {
  // Bearer ahtorization header field
  authorizationBearer?: Header<'Authorization'>;
  authorizationCookie?: Header<'Cookie'>;
} // AuthenticationParams

/**
 * Data returned after authentication verify
 */
export interface AuthenticationData {
  // identifier of the logged user
  userID: string;
  // role of the logged user
  userRole: UserRole;
} // AutheticationData
