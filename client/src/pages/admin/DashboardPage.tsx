import { useEffect, useState } from 'react';
import { fetchBookings } from '../../api/bookings';
import type { BookingWithService } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { formatTime } from '../../lib/utils';
import { CalendarDays, TrendingUp, Users, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns';

export function DashboardPage() {
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    fetchBookings({ from: weekStart, to: weekEnd })
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>;
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');
  const weekConfirmed = bookings.filter(b => b.status !== 'cancelled');
  const revenue = weekConfirmed.reduce((sum, b) => sum + b.service_price, 0);
  const upcoming = bookings.filter(b => b.date >= todayStr && b.status === 'confirmed');

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: CalendarDays, color: 'text-blue-600 bg-blue-100' },
    { label: 'This Week', value: weekConfirmed.length, icon: Users, color: 'text-purple-600 bg-purple-100' },
    { label: 'Week Revenue', value: `$${revenue.toFixed(0)}`, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
    { label: 'Upcoming', value: upcoming.length, icon: Clock, color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No upcoming appointments this week.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 8).map(b => {
              const bookingDate = new Date(b.date + 'T00:00:00');
              let dateLabel = format(bookingDate, 'EEE, MMM d');
              if (isToday(bookingDate)) dateLabel = 'Today';
              else if (isTomorrow(bookingDate)) dateLabel = 'Tomorrow';

              return (
                <div key={b.id} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.service_color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{b.client_name}</p>
                    <p className="text-xs text-slate-500">{b.service_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-700">{formatTime(b.start_time)}</p>
                    <p className="text-xs text-slate-500">{dateLabel}</p>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
