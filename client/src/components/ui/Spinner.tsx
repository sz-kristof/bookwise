import { cn } from '../../lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-slate-200 border-t-primary-600 w-6 h-6', className)} />
  );
}
