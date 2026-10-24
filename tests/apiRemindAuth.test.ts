import { verifyCronSecret } from '@/app/api/remind/route';

describe('verifyCronSecret', () => {
  const originalEnv = process.env.CRON_SECRET;

  afterEach(() => {
    process.env.CRON_SECRET = originalEnv;
  });

  it('returns false if CRON_SECRET is not configured on the server', () => {
    delete process.env.CRON_SECRET;
    const req = new Request('http://localhost/api/remind', {
      headers: { authorization: 'Bearer secret-123' },
    });
    expect(verifyCronSecret(req)).toBe(false);
  });

  it('returns false if request lacks authorization header and x-cron-secret', () => {
    process.env.CRON_SECRET = 'valid-secret-123';
    const req = new Request('http://localhost/api/remind');
    expect(verifyCronSecret(req)).toBe(false);
  });

  it('returns false if bearer token does not match CRON_SECRET', () => {
    process.env.CRON_SECRET = 'valid-secret-123';
    const req = new Request('http://localhost/api/remind', {
      headers: { authorization: 'Bearer wrong-secret' },
    });
    expect(verifyCronSecret(req)).toBe(false);
  });

  it('returns true if bearer token matches CRON_SECRET', () => {
    process.env.CRON_SECRET = 'valid-secret-123';
    const req = new Request('http://localhost/api/remind', {
      headers: { authorization: 'Bearer valid-secret-123' },
    });
    expect(verifyCronSecret(req)).toBe(true);
  });

  it('returns true if x-cron-secret matches CRON_SECRET', () => {
    process.env.CRON_SECRET = 'valid-secret-123';
    const req = new Request('http://localhost/api/remind', {
      headers: { 'x-cron-secret': 'valid-secret-123' },
    });
    expect(verifyCronSecret(req)).toBe(true);
  });
});
