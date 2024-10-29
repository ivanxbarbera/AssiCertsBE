import { api, APIError } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
import { SignJWT } from 'jose';

/**
 * JWT Secret.
 */
const jwtSercretKey = secret('JWTSecretKey');

/**
 * Data received in the login request
 */
interface LoginRequest {
  username: string;
  password: string;
} // LoginRequest

/**
 * Data returned in the login response
 */
interface LoginResponse {
  token: string;
} // LoginResponse

/**
 * Login API.
 * Request for login posted by the client.
 * Check the credentials and if right return the authentication token.
 * If wrong return a permission denied error.
 */
export const login = api({ expose: true, method: 'POST', path: '/login' }, async (request: LoginRequest): Promise<LoginResponse> => {
  // TODO MIC check user credentials
  const userAllowed = request.username == 'admin' && request.password == 'secret';
  const userID = '3939032';
  if (userAllowed) {
    // user allowed to access
    // generate token
    const token = await new SignJWT({ userID })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()    
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(jwtSercretKey()));
    // prepare response
    const response: LoginResponse = { token };
    return response;
  } else {
    // user not allowed to access
    throw APIError.permissionDenied('Unknown user');
  }
}); // login
