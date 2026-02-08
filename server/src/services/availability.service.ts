import db from '../config/database.js';
import type { Availability, Booking, TimeSlot } from '../types/index.js';

export function getAvailableSlots(date: string, serviceDuration: number): TimeSlot[] {
  const dayOfWeek = new Date(date + 'T00:00:00').getDay();

  const availability = db.prepare(
    'SELECT * FROM availability WHERE day_of_week = ? AND is_active = 1'
  ).get(dayOfWeek) as Availability | undefined;

  if (!availability) return [];

  const blocked = db.prepare(
    'SELECT id FROM blocked_dates WHERE date = ?'
  ).get(date);

  if (blocked) return [];

  const existingBookings = db.prepare(
    "SELECT start_time, end_time FROM bookings WHERE date = ? AND status != 'cancelled'"
  ).all(date) as Pick<Booking, 'start_time' | 'end_time'>[];

  const slots: TimeSlot[] = [];
  const [startH, startM] = availability.start_time.split(':').map(Number);
  const [endH, endM] = availability.end_time.split(':').map(Number);

  let currentMinutes = startH! * 60 + startM!;
  const endMinutes = endH! * 60 + endM!;

  while (currentMinutes + serviceDuration <= endMinutes) {
    const slotStart = formatTime(currentMinutes);
    const slotEnd = formatTime(currentMinutes + serviceDuration);

    const isBooked = existingBookings.some(b => {
      const bStart = timeToMinutes(b.start_time);
      const bEnd = timeToMinutes(b.end_time);
      return currentMinutes < bEnd && currentMinutes + serviceDuration > bStart;
    });

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      available: !isBooked,
    });

    currentMinutes += 30; // 30-minute intervals
  }

  return slots;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h! * 60 + m!;
}
