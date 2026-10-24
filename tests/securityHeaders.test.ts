import nextConfig from '../next.config';

describe('HTTP Security Headers Configuration', () => {
  it('defines headers function returning standard security headers for all routes', async () => {
    // nextConfig might be config object or function
    const resolvedConfig = typeof nextConfig === 'function' ? await nextConfig('phase-production-build', {}) : nextConfig;
    expect(typeof resolvedConfig.headers).toBe('function');

    const headersList = await resolvedConfig.headers();
    expect(Array.isArray(headersList)).toBe(true);

    const rootHeaderConfig = headersList.find((h: { source: string }) => h.source === '/(.*)' || h.source === '/:path*');
    expect(rootHeaderConfig).toBeDefined();

    const headersMap = new Map(
      rootHeaderConfig.headers.map((item: { key: string; value: string }) => [item.key.toLowerCase(), item.value])
    );

    expect(headersMap.get('x-frame-options')).toBe('DENY');
    expect(headersMap.get('x-content-type-options')).toBe('nosniff');
    expect(headersMap.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(headersMap.has('permissions-policy')).toBe(true);
  });
});
