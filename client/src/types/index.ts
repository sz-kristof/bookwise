export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  color: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  service_id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface BookingWithService extends Booking {
  service_name: string;
  service_duration: number;
  service_price: number;
  service_color: string;
}

export interface Availability {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: number;
}

export interface BlockedDate {
  id: number;
  date: string;
  reason: string | null;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CreateBookingData {
  serviceId: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  notes?: string;
}
