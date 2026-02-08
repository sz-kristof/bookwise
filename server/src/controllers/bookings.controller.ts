import type { Request, Response } from 'express';
import db from '../config/database.js';
import type { Booking, Service } from '../types/index.js';
import { sendBookingConfirmation, sendBookingCancellation } from '../services/email.service.js';

export function getAllBookings(req: Request, res: Response) {
  let query = `
    SELECT b.*, s.name as service_name, s.duration as service_duration,
           s.price as service_price, s.color as service_color
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (req.query.date) {
    query += ' AND b.date = ?';
    params.push(req.query.date);
  }
  if (req.query.from) {
    query += ' AND b.date >= ?';
    params.push(req.query.from);
  }
  if (req.query.to) {
    query += ' AND b.date <= ?';
    params.push(req.query.to);
  }
  if (req.query.status) {
    query += ' AND b.status = ?';
    params.push(req.query.status);
  }

  query += ' ORDER BY b.date DESC, b.start_time ASC';

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const bookings = db.prepare(query).all(...params);
  res.json(bookings);
}

export function getBookingById(req: Request, res: Response) {
  const booking = db.prepare(`
    SELECT b.*, s.name as service_name, s.duration as service_duration,
           s.price as service_price, s.color as service_color
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE b.id = ?
  `).get(req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json(booking);
}

export function createBooking(req: Request, res: Response) {
  const { serviceId, clientName, clientEmail, clientPhone, date, startTime, notes } = req.body;

  const service = db.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').get(serviceId) as Service | undefined;
  if (!service) {
    res.status(400).json({ error: 'Service not found or inactive' });
    return;
  }

  // Calculate end time
  const [h, m] = startTime.split(':').map(Number);
  const endMinutes = h * 60 + m + service.duration;
  const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

  // Check for conflicts
  const conflict = db.prepare(`
    SELECT id FROM bookings
    WHERE date = ? AND status != 'cancelled'
    AND start_time < ? AND end_time > ?
  `).get(date, endTime, startTime);

  if (conflict) {
    res.status(409).json({ error: 'Time slot is already booked' });
    return;
  }

  const result = db.prepare(
    'INSERT INTO bookings (service_id, client_name, client_email, client_phone, date, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(serviceId, clientName, clientEmail, clientPhone || null, date, startTime, endTime, notes || null);

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid) as Booking;
  sendBookingConfirmation(booking, service);

  res.status(201).json(booking);
}

export function updateBookingStatus(req: Request, res: Response) {
  const { status } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as Booking | undefined;

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);

  if (status === 'cancelled') {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(booking.service_id) as Service;
    sendBookingCancellation(booking, service);
  }

  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function deleteBooking(req: Request, res: Response) {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.json({ message: 'Booking deleted' });
}
