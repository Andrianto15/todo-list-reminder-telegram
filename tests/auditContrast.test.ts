import fs from 'fs';
import path from 'path';

describe('Badge Contrast & Theming Token Verification', () => {
  const rootDir = process.cwd();

  test('StatusBadge to_do and hold statuses meet WCAG AA contrast standard (>= 4.5:1)', () => {
    const badgePath = path.join(rootDir, 'src', 'components', 'tasks', 'StatusBadge.tsx');
    const content = fs.readFileSync(badgePath, 'utf8');

    // to_do text in light mode should use darker steel blue (#2b5373 or #244b6b) instead of #4682b4 on #eef5fa
    expect(content).toMatch(/text-\[#(2b5373|244b6b|234968)\]/);
    // hold text in light mode should use amber-800 instead of amber-600 on amber-50
    expect(content).toContain('text-amber-800');
  });

  test('layout.tsx and dashboard page leverage semantic background/foreground tokens', () => {
    const layoutPath = path.join(rootDir, 'src', 'app', 'layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toContain('bg-background');
    expect(layoutContent).toContain('text-foreground');
    expect(layoutContent).not.toContain('bg-[#f8fafc]');

    const dashboardPath = path.join(rootDir, 'src', 'app', 'dashboard', 'page.tsx');
    const dashContent = fs.readFileSync(dashboardPath, 'utf8');
    expect(dashContent).toContain('bg-background');
    expect(dashContent).not.toContain('bg-[#f8fafc]');
  });

  test('Navbar uses semantic background and border classes', () => {
    const navPath = path.join(rootDir, 'src', 'components', 'ui', 'Navbar.tsx');
    const navContent = fs.readFileSync(navPath, 'utf8');
    expect(navContent).toContain('bg-surface');
    expect(navContent).toContain('border-border');
  });
});
