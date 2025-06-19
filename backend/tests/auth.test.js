const app = require('../server');
let server;
let baseUrl;

jest.mock('@supabase/supabase-js', () => {
  const auth = {
    signUp: jest.fn(() => Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' } }, error: null })),
    signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' }, session: {} }, error: null }))
  };
  return { createClient: jest.fn(() => ({ auth })) };
});

jest.mock('../models/verificationCodes', () => ({
  createOrUpdateVerificationCode: jest.fn(() => Promise.resolve({ code: '123456' })),
  getVerificationStatus: jest.fn(() => Promise.resolve({ verified: true }))
}));

jest.mock('../utils/smsService', () => ({
  validatePhoneNumber: jest.fn(() => true),
  formatPhoneNumber: jest.fn((p) => p),
  sendVerificationSMS: jest.fn(() => Promise.resolve())
}));

describe('Auth endpoints', () => {
  beforeAll(done => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  afterAll(() => {
    server.close();
  });

  it('registers a user', async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret', name: 'Test', phone: '0500000000' })
    });
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it('logs in a user', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' })
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.verification_required).toBe(false);
  });
});
