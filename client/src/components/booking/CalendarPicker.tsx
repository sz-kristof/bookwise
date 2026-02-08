import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { isBefore, startOfDay } from 'date-fns';

interface CalendarPickerProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
}

export function CalendarPicker({ selected, onSelect }: CalendarPickerProps) {
  const today = startOfDay(new Date());

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Select a Date</h3>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selected ?? undefined}
          onSelect={(date) => date && onSelect(date)}
          disabled={(date) => isBefore(date, today)}
          className="rdp-custom"
        />
      </div>
    </div>
  );
}
