import basicAuth from 'express-basic-auth';

export function createAuthMiddleware(user: string, pass: string) {
  return basicAuth({
    users: { [user]: pass },
    challenge: true,
    realm: 'AIHOT Mail Admin',
  });
}
