const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Log = require('../database/log.model');

describe('LogsController Unit Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockuser123', email: 'log@mail.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lista logs (requiere auth)', async () => {
    jest.spyOn(Log, 'find').mockResolvedValue([
      { _id: 'log1', accion: 'LOGIN', fecha: new Date() }
    ]);

    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
