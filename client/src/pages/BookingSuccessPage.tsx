import { Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatTime, formatPrice, formatDuration } from '../lib/utils';
import { CheckCircle, Calendar, Clock, Mail } from 'lucide-react';
import { format } from 'date-fns';

export function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state as {
    booking: { id: number; date: string; start_time: string; client_name: string; client_email: string };
    service: { name: string; duration: number; price: number; color: string };
    date: string;
    time: string;
  } | null;

  if (!state) return <Navigate to="/book" replace />;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
      <p className="text-slate-500 mt-2">Your appointment has been successfully booked.</p>

      <Card className="p-6 mt-8 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: state.service.color }} />
            <span className="font-semibold text-slate-900">{state.service.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{format(new Date(state.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{formatTime(state.time)} ({formatDuration(state.service.duration)}) - {formatPrice(state.service.price)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Confirmation sent to {state.booking.client_email}</span>
          </div>
        </div>
      </Card>

      <p className="text-xs text-slate-400 mt-4">Booking reference: #{state.booking.id}</p>

      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/book">
          <Button variant="secondary">Book Another</Button>
        </Link>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
