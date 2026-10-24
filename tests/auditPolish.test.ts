import fs from 'fs';
import path from 'path';

describe('Impeccable Polish Verification', () => {
  const rootDir = process.cwd();

  test('globals.css configures themed browser surfaces (selection and caret)', () => {
    const cssPath = path.join(rootDir, 'src', 'app', 'globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).toContain('::selection');
    expect(content).toContain('caret-color');
  });

  test('ConfirmDialog and EmptyState adopt semantic design tokens', () => {
    const confirmPath = path.join(rootDir, 'src', 'components', 'ui', 'ConfirmDialog.tsx');
    const confirmContent = fs.readFileSync(confirmPath, 'utf8');
    expect(confirmContent).toContain('text-foreground');
    expect(confirmContent).toContain('border-border');
    expect(confirmContent).not.toContain('text-[#0f172a]');

    const emptyPath = path.join(rootDir, 'src', 'components', 'ui', 'EmptyState.tsx');
    const emptyContent = fs.readFileSync(emptyPath, 'utf8');
    expect(emptyContent).toContain('text-foreground');
    expect(emptyContent).toContain('text-muted');
    expect(emptyContent).toContain('border-border');
    expect(emptyContent).not.toContain('text-[#0f172a]');
  });

  test('Top3Highlight and TelegramSettings adopt semantic tokens', () => {
    const top3Path = path.join(rootDir, 'src', 'components', 'tasks', 'Top3Highlight.tsx');
    const top3Content = fs.readFileSync(top3Path, 'utf8');
    expect(top3Content).toContain('bg-surface');
    expect(top3Content).toContain('border-border');
    expect(top3Content).toContain('text-foreground');

    const tgPath = path.join(rootDir, 'src', 'app', 'settings', 'telegram', 'page.tsx');
    const tgContent = fs.readFileSync(tgPath, 'utf8');
    expect(tgContent).toContain('bg-background');
    expect(tgContent).toContain('text-foreground');
  });
});
