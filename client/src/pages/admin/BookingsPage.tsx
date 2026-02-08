import { useEffect, useState, useCallback } from 'react';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../../api/bookings';
import type { BookingWithService } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { formatTime, formatPrice } from '../../lib/utils';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const statusVariants = {
  confirmed: 'success' as const,
  completed: 'default' as const,
  cancelled: 'danger' as const,
};

export function BookingsPage() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookingWithService | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadBookings = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    fetchBookings(params).then(setBookings).finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      addToast(`Booking ${status}`, 'success');
      loadBookings();
      setSelected(null);
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      addToast('Booking deleted', 'success');
      loadBookings();
      setSelected(null);
    } catch {
      addToast('Failed to delete booking', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No bookings found.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.client_name}</p>
                      <p className="text-xs text-slate-500">{b.client_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.service_color }} />
                        {b.service_name}
                      </div>
                    </td>
                    <td className="px-4 py-3">{format(new Date(b.date + 'T00:00:00'), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3">{formatTime(b.start_time)}</td>
                    <td className="px-4 py-3">{formatPrice(b.service_price)}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariants[b.status]}>{b.status}</Badge></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(b)} className="p-1 hover:bg-slate-100 rounded"><Eye className="w-4 h-4 text-slate-500" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {bookings.map(b => (
              <div key={b.id} className="p-4" onClick={() => setSelected(b)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">{b.client_name}</p>
                  <Badge variant={statusVariants[b.status]}>{b.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.service_color }} />
                  <span>{b.service_name}</span>
                  <span>-</span>
                  <span>{format(new Date(b.date + 'T00:00:00'), 'MMM d')}</span>
                  <span>{formatTime(b.start_time)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Booking Details">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Client</p>
              <p className="font-medium">{selected.client_name}</p>
              <p className="text-sm text-slate-500">{selected.client_email}</p>
              {selected.client_phone && <p className="text-sm text-slate-500">{selected.client_phone}</p>}
            </div>
            <div>
              <p className="text-sm text-slate-500">Service</p>
              <p className="font-medium">{selected.service_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-medium">{format(new Date(selected.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Time</p>
                <p className="font-medium">{formatTime(selected.start_time)} - {formatTime(selected.end_time)}</p>
              </div>
            </div>
            {selected.notes && (
              <div>
                <p className="text-sm text-slate-500">Notes</p>
                <p className="text-sm">{selected.notes}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {selected.status === 'confirmed' && (
                <>
                  <Button size="sm" onClick={() => handleStatusChange(selected.id, 'completed')}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Complete
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleStatusChange(selected.id, 'cancelled')}>
                    <XCircle className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" onClick={() => handleDelete(selected.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
