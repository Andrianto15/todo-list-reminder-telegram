import fs from 'fs';
import path from 'path';

describe('TaskFilter Layout & CSS Cascade Verification', () => {
  const rootDir = process.cwd();

  test('globals.css wraps input/textarea/select inside @layer base to preserve utility specificity', () => {
    const cssPath = path.join(rootDir, 'src', 'app', 'globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).toMatch(/@layer\s+base\s*\{[\s\S]*input,[\s\S]*textarea,[\s\S]*select[\s\S]*\}/);
  });

  test('TaskFilter search icon has pointer-events-none for seamless touch/click interaction', () => {
    const filterPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskFilter.tsx');
    const content = fs.readFileSync(filterPath, 'utf8');

    expect(content).toMatch(/<Search[\s\S]*?className="[^"]*pointer-events-none[^"]*"/);
  });

  test('TaskFilter input has explicit padding to prevent icon overlapping', () => {
    const filterPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskFilter.tsx');
    const content = fs.readFileSync(filterPath, 'utf8');

    expect(content).toMatch(/<input[\s\S]*?className="[^"]*!pl-10[^"]*!pr-10[^"]*"/);
  });
});
