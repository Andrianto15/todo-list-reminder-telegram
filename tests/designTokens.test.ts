import fs from 'fs';
import path from 'path';

describe('Design Tokens Verification (docs/DESIGN.md)', () => {
  const rootDir = process.cwd();

  test('DESIGN.md exists and contains primary design tokens', () => {
    const designPath = path.join(rootDir, 'docs', 'DESIGN.md');
    expect(fs.existsSync(designPath)).toBe(true);

    const content = fs.readFileSync(designPath, 'utf8');
    expect(content).toContain('primary: "#4682b4"');
    expect(content).toContain('primary-hover: "#36648b"');
    expect(content).toContain('accent: "#0ea5e9"');
    expect(content).toContain('neutral-bg: "#f8fafc"');
    expect(content).toContain('neutral-surface: "#ffffff"');
    expect(content).toContain('neutral-border: "#e2e8f0"');
    expect(content).toContain('text-primary: "#0f172a"');
    expect(content).toContain('Public Sans');
    expect(content).toContain('JetBrains Mono');
    expect(content).toContain('0.875rem');
    expect(content).toContain('0.5rem');
    expect(content).toContain('1rem');
  });

  test('globals.css applies DESIGN.md theme tokens', () => {
    const cssPath = path.join(rootDir, 'src', 'app', 'globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('--primary: #4682b4');
    expect(cssContent).toContain('--primary-hover: #36648b');
    expect(cssContent).toContain('--accent: #0ea5e9');
    expect(cssContent).toContain('--background: #f8fafc');
    expect(cssContent).toContain('--surface: #ffffff');
    expect(cssContent).toContain('--border: #e2e8f0');
    expect(cssContent).toContain('--foreground: #0f172a');
    expect(cssContent).toContain('--text-muted: #64748b');
    expect(cssContent).toContain('Public Sans');
    expect(cssContent).toContain('JetBrains Mono');
  });

  test('Root layout configures font and theme styles', () => {
    const layoutPath = path.join(rootDir, 'src', 'app', 'layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toContain('Public Sans');
    expect(layoutContent).toContain('JetBrains Mono');
  });
});
