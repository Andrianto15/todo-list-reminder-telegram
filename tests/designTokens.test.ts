import fs from 'fs';
import path from 'path';

describe('Design Tokens Verification (docs/DESIGN.md)', () => {
  const rootDir = process.cwd();

  test('DESIGN.md exists and contains primary design tokens', () => {
    const designPath = path.join(rootDir, 'docs', 'DESIGN.md');
    expect(fs.existsSync(designPath)).toBe(true);

    const content = fs.readFileSync(designPath, 'utf8');
    expect(content).toContain('primary: "#0051c3"');
    expect(content).toContain('text: "#404040"');
    expect(content).toContain('border: "#ebebeb"');
    expect(content).toContain('surface: "#ebebeb"');
    expect(content).toContain('background: "#ffffff"');
    expect(content).toContain('-apple-system');
    expect(content).toContain('fontSize: 13px');
    expect(content).toContain('base: 3px');
    expect(content).toContain('sm: 5px');
    expect(content).toContain('150ms');
  });

  test('globals.css applies DESIGN.md theme tokens', () => {
    const cssPath = path.join(rootDir, 'src', 'app', 'globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('--primary: #0051c3');
    expect(cssContent).toContain('--foreground: #404040');
    expect(cssContent).toContain('--border: #ebebeb');
    expect(cssContent).toContain('--surface: #ebebeb');
    expect(cssContent).toContain('-apple-system');
    expect(cssContent).toContain('font-size: 13px');
    expect(cssContent).toContain('--radius-sm: 5px');
    expect(cssContent).toContain('150ms ease');
  });

  test('Root layout configures clean system font stack', () => {
    const layoutPath = path.join(rootDir, 'src', 'app', 'layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toContain('font-sans');
    expect(layoutContent).toContain('text-[#404040]');
  });
});
