const { createUser, findUserByEmail } = require('../services/user.service');

describe('User Service', () => {
  it('should create a user', async () => {
    const userData = { email: 'test@example.com', password: 'password' };
    const user = await createUser(userData);
    expect(user.email).toBe(userData.email);
  });

  it('should find user by email', async () => {
    const email = 'test@example.com';
    const user = await findUserByEmail(email);
    expect(user.email).toBe(email);
  });
});