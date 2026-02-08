import api from './client';
import type { Availability, BlockedDate, TimeSlot } from '../types';

export async function fetchWeeklySchedule(): Promise<Availability[]> {
  const { data } = await api.get<Availability[]>('/availability');
  return data;
}

export async function updateWeeklySchedule(schedule: Partial<Availability>[]): Promise<Availability[]> {
  const { data } = await api.put<Availability[]>('/availability', { schedule });
  return data;
}

export async function fetchSlots(date: string, serviceId: number): Promise<{ date: string; slots: TimeSlot[] }> {
  const { data } = await api.get<{ date: string; slots: TimeSlot[] }>('/availability/slots', {
    params: { date, serviceId },
  });
  return data;
}

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  const { data } = await api.get<BlockedDate[]>('/availability/blocked-dates');
  return data;
}

export async function addBlockedDate(date: string, reason?: string): Promise<BlockedDate> {
  const { data } = await api.post<BlockedDate>('/availability/blocked-dates', { date, reason });
  return data;
}

export async function removeBlockedDate(id: number): Promise<void> {
  await api.delete(`/availability/blocked-dates/${id}`);
}
