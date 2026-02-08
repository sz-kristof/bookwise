import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { APP_NAME } from '../../lib/constants';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
          <Calendar className="w-7 h-7" />
          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/book" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
            Book Now
          </Link>
          <Link to="/admin/login" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
