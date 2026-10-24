import crypto from 'crypto';

export function verifyTelegramWebhookSecret(request: Request): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return false;

  const headerSecret = request.headers.get('x-telegram-bot-api-secret-token');
  if (!headerSecret) return false;

  const expectedBuffer = Buffer.from(secret);
  const actualBuffer = Buffer.from(headerSecret);
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
