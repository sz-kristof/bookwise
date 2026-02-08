import { APP_NAME } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. Portfolio project for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
