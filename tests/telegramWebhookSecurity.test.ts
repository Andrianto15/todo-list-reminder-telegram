import { verifyTelegramWebhookSecret } from '@/lib/security/telegram';

describe('verifyTelegramWebhookSecret', () => {
  const originalSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  afterEach(() => {
    process.env.TELEGRAM_WEBHOOK_SECRET = originalSecret;
  });

  it('returns false when TELEGRAM_WEBHOOK_SECRET is not configured', () => {
    delete process.env.TELEGRAM_WEBHOOK_SECRET;
    const req = new Request('http://localhost/api/webhook/telegram', {
      headers: { 'x-telegram-bot-api-secret-token': 'any-secret' },
    });
    expect(verifyTelegramWebhookSecret(req)).toBe(false);
  });

  it('returns false when x-telegram-bot-api-secret-token header is missing', () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = 'configured-secret';
    const req = new Request('http://localhost/api/webhook/telegram');
    expect(verifyTelegramWebhookSecret(req)).toBe(false);
  });

  it('returns false when secret token in header does not match', () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = 'configured-secret';
    const req = new Request('http://localhost/api/webhook/telegram', {
      headers: { 'x-telegram-bot-api-secret-token': 'wrong-secret' },
    });
    expect(verifyTelegramWebhookSecret(req)).toBe(false);
  });

  it('returns true when secret token matches configured TELEGRAM_WEBHOOK_SECRET', () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = 'configured-secret';
    const req = new Request('http://localhost/api/webhook/telegram', {
      headers: { 'x-telegram-bot-api-secret-token': 'configured-secret' },
    });
    expect(verifyTelegramWebhookSecret(req)).toBe(true);
  });
});
