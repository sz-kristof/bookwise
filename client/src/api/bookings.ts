import api from './client';
import type { Booking, BookingWithService, CreateBookingData } from '../types';

export async function fetchBookings(params?: Record<string, string>): Promise<BookingWithService[]> {
  const { data } = await api.get<BookingWithService[]>('/bookings', { params });
  return data;
}

export async function fetchBookingById(id: number): Promise<BookingWithService> {
  const { data } = await api.get<BookingWithService>(`/bookings/${id}`);
  return data;
}

export async function createBooking(booking: CreateBookingData): Promise<Booking> {
  const { data } = await api.post<Booking>('/bookings', booking);
  return data;
}

export async function updateBookingStatus(id: number, status: string): Promise<Booking> {
  const { data } = await api.patch<Booking>(`/bookings/${id}/status`, { status });
  return data;
}

export async function deleteBooking(id: number): Promise<void> {
  await api.delete(`/bookings/${id}`);
}
