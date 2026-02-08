import { useEffect, useState } from 'react';
import { fetchSlots } from '../../api/availability';
import type { TimeSlot } from '../../types';
import { formatTime, cn } from '../../lib/utils';
import { Spinner } from '../ui/Spinner';

interface TimeSlotGridProps {
  date: string;
  serviceId: number;
  selected: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotGrid({ date, serviceId, selected, onSelect }: TimeSlotGridProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSlots(date, serviceId)
      .then(data => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date, serviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const availableSlots = slots.filter(s => s.available);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No available slots for this date.</p>
        <p className="text-sm text-slate-400 mt-1">Please try a different date.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Select a Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(slot => (
          <button
            key={slot.startTime}
            onClick={() => slot.available && onSelect(slot.startTime)}
            disabled={!slot.available}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              slot.available
                ? selected === slot.startTime
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-primary-400 hover:text-primary-600'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
            )}
          >
            {formatTime(slot.startTime)}
          </button>
        ))}
      </div>
    </div>
  );
}
