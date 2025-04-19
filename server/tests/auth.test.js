const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should return 401 for /api/auth/me when not logged in', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
