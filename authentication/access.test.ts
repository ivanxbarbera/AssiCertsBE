import { describe, expect, test } from 'vitest';
import { login } from './access';

/**
 * Test for login API.
 */
describe('login', () => {
  // test for correct login
  test('trying right user credentials', async () => {
    const resp = await login({ username: 'admin', password: 'secret' });
    expect(resp.token).toBeDefined();
  });
  // test for wrong login
  test('trying wrong user credentials', async () => {
    await expect(login({ username: 'john.doe', password: 'foo' })).rejects.toThrow('Unknown user');
  });
});
