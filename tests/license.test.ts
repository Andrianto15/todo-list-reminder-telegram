import fs from 'fs';
import path from 'path';

describe('License and Project Metadata', () => {
  const rootDir = path.resolve(__dirname, '..');
  const licensePath = path.join(rootDir, 'LICENSE');
  const packageJsonPath = path.join(rootDir, 'package.json');
  const readmePath = path.join(rootDir, 'README.md');

  test('LICENSE file exists in root and contains MIT license terms', () => {
    expect(fs.existsSync(licensePath)).toBe(true);
    const content = fs.readFileSync(licensePath, 'utf8');
    expect(content).toContain('MIT License');
    expect(content).toContain('Copyright (c) 2026 Andrianto Nur Iskandar');
    expect(content).toContain('Permission is hereby granted, free of charge');
  });

  test('package.json specifies MIT license', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(pkg.license).toBe('MIT');
  });

  test('README.md references MIT License', () => {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    expect(readmeContent).toMatch(/## Lisensi|## License/i);
    expect(readmeContent).toContain('MIT');
  });
});
