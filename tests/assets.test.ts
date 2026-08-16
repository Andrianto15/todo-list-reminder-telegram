import fs from 'fs';
import path from 'path';

describe('Application Logo & Asset Verification', () => {
  const rootDir = process.cwd();

  test('PWA icons exist and are valid files', () => {
    const icon192 = path.join(rootDir, 'public', 'icons', 'icon-192x192.png');
    const icon512 = path.join(rootDir, 'public', 'icons', 'icon-512x512.png');
    const logo = path.join(rootDir, 'public', 'icons', 'logo.png');

    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.statSync(icon192).size).toBeGreaterThan(1000);

    expect(fs.existsSync(icon512)).toBe(true);
    expect(fs.statSync(icon512).size).toBeGreaterThan(1000);

    expect(fs.existsSync(logo)).toBe(true);
    expect(fs.statSync(logo).size).toBeGreaterThan(1000);
  });

  test('Favicon exists and is a valid file', () => {
    const appFavicon = path.join(rootDir, 'src', 'app', 'favicon.ico');
    const publicFavicon = path.join(rootDir, 'public', 'favicon.ico');

    expect(fs.existsSync(appFavicon)).toBe(true);
    expect(fs.statSync(appFavicon).size).toBeGreaterThan(500);

    expect(fs.existsSync(publicFavicon)).toBe(true);
    expect(fs.statSync(publicFavicon).size).toBeGreaterThan(500);
  });

  test('manifest.json references the correct icons', () => {
    const manifestPath = path.join(rootDir, 'public', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifestContent.icons).toBeDefined();
    expect(Array.isArray(manifestContent.icons)).toBe(true);

    const sizes = manifestContent.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });
});
