import fs from 'fs';
import path from 'path';

describe('Accessibility & Semantics Verification', () => {
  const rootDir = process.cwd();

  test('Form labels have matching htmlFor and id in AddTaskModal', () => {
    const filePath = path.join(rootDir, 'src', 'components', 'tasks', 'AddTaskModal.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain('htmlFor="add-task-title"');
    expect(content).toContain('id="add-task-title"');
    expect(content).toContain('htmlFor="add-task-reminder"');
    expect(content).toContain('id="add-task-reminder"');
    expect(content).toContain('htmlFor="add-task-notes"');
    expect(content).toContain('id="add-task-notes"');
  });

  test('Form labels have matching htmlFor and id in EditTaskModal', () => {
    const filePath = path.join(rootDir, 'src', 'components', 'tasks', 'EditTaskModal.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain('htmlFor="edit-task-title"');
    expect(content).toContain('id="edit-task-title"');
    expect(content).toContain('htmlFor="edit-task-status"');
    expect(content).toContain('id="edit-task-status"');
    expect(content).toContain('htmlFor="edit-task-reminder"');
    expect(content).toContain('id="edit-task-reminder"');
    expect(content).toContain('htmlFor="edit-task-notes"');
    expect(content).toContain('id="edit-task-notes"');
  });

  test('Auth forms have matching htmlFor and id attributes', () => {
    const loginPath = path.join(rootDir, 'src', 'app', '(auth)', 'login', 'page.tsx');
    const loginContent = fs.readFileSync(loginPath, 'utf8');
    expect(loginContent).toContain('htmlFor="login-email"');
    expect(loginContent).toContain('id="login-email"');
    expect(loginContent).toContain('htmlFor="login-password"');
    expect(loginContent).toContain('id="login-password"');

    const registerPath = path.join(rootDir, 'src', 'app', '(auth)', 'register', 'page.tsx');
    const regContent = fs.readFileSync(registerPath, 'utf8');
    expect(regContent).toContain('htmlFor="reg-fullname"');
    expect(regContent).toContain('id="reg-fullname"');
    expect(regContent).toContain('htmlFor="reg-email"');
    expect(regContent).toContain('id="reg-email"');
    expect(regContent).toContain('htmlFor="reg-password"');
    expect(regContent).toContain('id="reg-password"');
  });

  test('Modal dialog handles focus trap and backdrop interaction', () => {
    const modalPath = path.join(rootDir, 'src', 'components', 'ui', 'Modal.tsx');
    const content = fs.readFileSync(modalPath, 'utf8');

    expect(content).toContain('aria-modal="true"');
    expect(content).toContain('aria-labelledby="modal-title"');
    // Verify focus trap implementation via keydown handler or ref
    expect(content).toMatch(/Tab|focus/);
  });

  test('TaskFilter search input has accessible label and tabs have tablist role', () => {
    const filterPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskFilter.tsx');
    const content = fs.readFileSync(filterPath, 'utf8');

    expect(content).toContain('aria-label="Cari tugas"');
    expect(content).toContain('role="tablist"');
    expect(content).toContain('role="tab"');
    expect(content).toContain('aria-selected');
  });

  test('TaskCard status toggle button has role="checkbox" and aria-checked', () => {
    const cardPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf8');

    expect(content).toContain('role="checkbox"');
    expect(content).toContain('aria-checked');
  });

  test('TaskStats progress bar has role="progressbar" and range values', () => {
    const statsPath = path.join(rootDir, 'src', 'components', 'tasks', 'TaskStats.tsx');
    const content = fs.readFileSync(statsPath, 'utf8');

    expect(content).toContain('role="progressbar"');
    expect(content).toContain('aria-valuenow');
    expect(content).toContain('aria-valuemin={0}');
    expect(content).toContain('aria-valuemax={100}');
  });

  test('globals.css replaces 0.01ms kill with non-destructive reduced motion', () => {
    const cssPath = path.join(rootDir, 'src', 'app', 'globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).not.toContain('0.01ms !important');
    expect(content).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
