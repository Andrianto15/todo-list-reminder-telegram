import crypto from 'crypto';

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader =
    request.headers.get('authorization') ||
    request.headers.get('upstash-forward-authorization');
  const cronSecretHeader =
    request.headers.get('x-cron-secret') ||
    request.headers.get('upstash-forward-x-cron-secret');

  let token = '';
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (cronSecretHeader) {
    token = cronSecretHeader.trim();
  }

  if (!token) return false;

  const expectedBuffer = Buffer.from(secret);
  const actualBuffer = Buffer.from(token);
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
