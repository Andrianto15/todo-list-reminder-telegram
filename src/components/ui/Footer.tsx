import packageJson from '../../../package.json';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-auto py-6 px-4 bg-background transition-colors">
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted text-center sm:text-left">
        <p>
          © 2026 Andrianto Nur Iskandar. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span>MIT License</span>
          <span>•</span>
          <span className="font-mono">v{packageJson.version}</span>
        </div>
      </div>
    </footer>
  );
}
