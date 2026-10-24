import nextConfig from '../next.config';

describe('HTTP Security Headers Configuration', () => {
  it('defines headers function returning standard security headers for all routes', async () => {
    const configExport = nextConfig as unknown;
    const resolvedConfig: any =
      typeof configExport === 'function'
        ? await (configExport as (phase: string, context: Record<string, unknown>) => Promise<any> | any)(
            'phase-production-build',
            {}
          )
        : nextConfig;
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
