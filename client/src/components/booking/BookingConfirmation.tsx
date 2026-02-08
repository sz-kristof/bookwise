import type { Service } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatPrice, formatDuration, formatTime } from '../../lib/utils';
import { Calendar, Clock, User, Mail, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  service: Service;
  date: Date;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function BookingConfirmation({
  service, date, time, clientName, clientEmail, clientPhone, notes,
  onConfirm, onBack, loading,
}: BookingConfirmationProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Confirm Your Booking</h2>
      <p className="text-slate-500 text-sm mb-6">Please review the details below</p>

      <Card className="p-5 mb-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: service.color }} />
            <div>
              <p className="font-semibold text-slate-900">{service.name}</p>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(service.duration)}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatPrice(service.price)}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{formatTime(time)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{clientEmail}</span>
            </div>
          </div>

          {(clientPhone || notes) && (
            <>
              <hr className="border-slate-200" />
              {clientPhone && <p className="text-sm text-slate-600">Phone: {clientPhone}</p>}
              {notes && <p className="text-sm text-slate-600">Notes: {notes}</p>}
            </>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1" disabled={loading}>
          Back
        </Button>
        <Button onClick={onConfirm} className="flex-1" disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
}
