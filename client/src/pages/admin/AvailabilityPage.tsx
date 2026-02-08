import { useEffect, useState, useCallback } from 'react';
import { fetchWeeklySchedule, updateWeeklySchedule, fetchBlockedDates, addBlockedDate, removeBlockedDate } from '../../api/availability';
import type { Availability, BlockedDate } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { DAY_NAMES } from '../../lib/constants';
import { Save, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ScheduleRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const defaultSchedule: ScheduleRow[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  start_time: '09:00',
  end_time: '17:00',
  is_active: i >= 1 && i <= 5,
}));

export function AvailabilityPage() {
  const { addToast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleRow[]>(defaultSchedule);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sched, blocked] = await Promise.all([fetchWeeklySchedule(), fetchBlockedDates()]);
      if (sched.length > 0) {
        setSchedule(defaultSchedule.map(d => {
          const existing = sched.find((s: Availability) => s.day_of_week === d.day_of_week);
          return existing ? { ...d, start_time: existing.start_time, end_time: existing.end_time, is_active: !!existing.is_active } : d;
        }));
      }
      setBlockedDates(blocked);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      await updateWeeklySchedule(schedule.map(d => ({ ...d, is_active: d.is_active ? 1 : 0 })));
      addToast('Schedule saved', 'success');
    } catch {
      addToast('Failed to save schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockedDate) return;
    try {
      await addBlockedDate(newBlockedDate, newBlockedReason || undefined);
      addToast('Date blocked', 'success');
      setNewBlockedDate('');
      setNewBlockedReason('');
      loadData();
    } catch {
      addToast('Failed to block date', 'error');
    }
  };

  const handleRemoveBlockedDate = async (id: number) => {
    try {
      await removeBlockedDate(id);
      addToast('Blocked date removed', 'success');
      loadData();
    } catch {
      addToast('Failed to remove blocked date', 'error');
    }
  };

  const updateDay = (index: number, field: keyof ScheduleRow, value: string | boolean) => {
    setSchedule(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Availability</h1>

      {/* Weekly Schedule */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
          <Button onClick={handleSaveSchedule} disabled={saving} size="sm">
            <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="space-y-3">
          {schedule.map((day, index) => (
            <div key={day.day_of_week} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
              <label className="flex items-center gap-2 w-28 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={day.is_active}
                  onChange={e => updateDay(index, 'is_active', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className={`text-sm font-medium ${day.is_active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {DAY_NAMES[day.day_of_week]}
                </span>
              </label>
              {day.is_active ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start_time}
                    onChange={e => updateDay(index, 'start_time', e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={day.end_time}
                    onChange={e => updateDay(index, 'end_time', e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400">Closed</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Blocked Dates */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Blocked Dates</h2>
        <p className="text-sm text-slate-500 mb-4">Block specific dates (holidays, vacations, etc.)</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            id="blocked-date"
            type="date"
            value={newBlockedDate}
            onChange={e => setNewBlockedDate(e.target.value)}
            className="sm:w-48"
          />
          <Input
            id="blocked-reason"
            placeholder="Reason (optional)"
            value={newBlockedReason}
            onChange={e => setNewBlockedReason(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddBlockedDate} disabled={!newBlockedDate}>
            <Plus className="w-4 h-4 mr-1" /> Block
          </Button>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No blocked dates.</p>
        ) : (
          <div className="space-y-2">
            {blockedDates.map(bd => (
              <div key={bd.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    {format(new Date(bd.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                  </span>
                  {bd.reason && <span className="text-sm text-slate-500 ml-2">- {bd.reason}</span>}
                </div>
                <button onClick={() => handleRemoveBlockedDate(bd.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
