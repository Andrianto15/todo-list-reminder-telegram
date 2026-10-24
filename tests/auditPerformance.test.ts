import fs from 'fs';
import path from 'path';

describe('Performance & Next.js Font Optimization Verification', () => {
  const rootDir = process.cwd();

  test('layout.tsx imports and uses next/font/google instead of external link tags', () => {
    const layoutPath = path.join(rootDir, 'src', 'app', 'layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    expect(layoutContent).toContain('next/font/google');
    expect(layoutContent).toContain('Public_Sans');
    expect(layoutContent).toContain('JetBrains_Mono');
    expect(layoutContent).not.toContain('fonts.googleapis.com');
  });

  test('TaskFilter status pills enforce 44px min-height for touch targets', () => {
    const filterPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskFilter.tsx');
    const filterContent = fs.readFileSync(filterPath, 'utf8');

    expect(filterContent).toContain('min-h-[44px]');
    expect(filterContent).not.toContain('min-h-[40px]');
  });
});
