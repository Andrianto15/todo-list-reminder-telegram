import fs from 'fs';
import path from 'path';

describe('Footer Component and Login Copyright Verification', () => {
  const rootDir = process.cwd();
  const footerComponentPath = path.join(rootDir, 'src', 'components', 'ui', 'Footer.tsx');
  const loginPagePath = path.join(rootDir, 'src', 'app', '(auth)', 'login', 'page.tsx');
  const dashboardPagePath = path.join(rootDir, 'src', 'app', 'dashboard', 'page.tsx');
  const settingsPagePath = path.join(rootDir, 'src', 'app', 'settings', 'telegram', 'page.tsx');

  test('Footer component file exists and exports Footer', () => {
    expect(fs.existsSync(footerComponentPath)).toBe(true);
    const content = fs.readFileSync(footerComponentPath, 'utf8');
    expect(content).toMatch(/export\s+default\s+function\s+Footer/);
  });

  test('Footer component displays copyright, app version, and semantic tokens', () => {
    expect(fs.existsSync(footerComponentPath)).toBe(true);
    const content = fs.readFileSync(footerComponentPath, 'utf8');
    expect(content).toContain('packageJson.version');
    expect(content).toContain('Andrianto Nur Iskandar');
    expect(content).toContain('©');
    expect(content).toMatch(/border-border|text-muted/);
  });

  test('Login page contains copyright notice along with version', () => {
    const loginContent = fs.readFileSync(loginPagePath, 'utf8');
    expect(loginContent).toContain('packageJson.version');
    expect(loginContent).toContain('Andrianto Nur Iskandar');
    expect(loginContent).toContain('©');
  });

  test('Dashboard page includes Footer component', () => {
    const dashboardContent = fs.readFileSync(dashboardPagePath, 'utf8');
    expect(dashboardContent).toMatch(/import\s+Footer\s+from\s+['"]@\/components\/ui\/Footer['"]/);
    expect(dashboardContent).toContain('<Footer />');
  });

  test('Telegram settings page includes Footer component', () => {
    const settingsContent = fs.readFileSync(settingsPagePath, 'utf8');
    expect(settingsContent).toMatch(/import\s+Footer\s+from\s+['"]@\/components\/ui\/Footer['"]/);
    expect(settingsContent).toContain('<Footer />');
  });
});
