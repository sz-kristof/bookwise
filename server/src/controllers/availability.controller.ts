import type { Request, Response } from 'express';
import db from '../config/database.js';
import type { Service } from '../types/index.js';
import { getAvailableSlots } from '../services/availability.service.js';

export function getWeeklySchedule(_req: Request, res: Response) {
  const schedule = db.prepare('SELECT * FROM availability ORDER BY day_of_week').all();
  res.json(schedule);
}

export function updateWeeklySchedule(req: Request, res: Response) {
  const { schedule } = req.body;

  const upsert = db.prepare(`
    INSERT INTO availability (day_of_week, start_time, end_time, is_active)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(day_of_week) DO UPDATE SET
      start_time = excluded.start_time,
      end_time = excluded.end_time,
      is_active = excluded.is_active
  `);

  const transaction = db.transaction(() => {
    for (const day of schedule) {
      upsert.run(day.day_of_week, day.start_time, day.end_time, day.is_active ? 1 : 0);
    }
  });

  transaction();
  const updated = db.prepare('SELECT * FROM availability ORDER BY day_of_week').all();
  res.json(updated);
}

export function getSlots(req: Request, res: Response) {
  const { date, serviceId } = req.query;

  if (!date || !serviceId) {
    res.status(400).json({ error: 'date and serviceId query parameters are required' });
    return;
  }

  const service = db.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').get(serviceId) as Service | undefined;
  if (!service) {
    res.status(400).json({ error: 'Service not found' });
    return;
  }

  const slots = getAvailableSlots(date as string, service.duration);
  res.json({ date, slots });
}

export function getBlockedDates(_req: Request, res: Response) {
  const dates = db.prepare('SELECT * FROM blocked_dates ORDER BY date').all();
  res.json(dates);
}

export function addBlockedDate(req: Request, res: Response) {
  const { date, reason } = req.body;

  try {
    const result = db.prepare('INSERT INTO blocked_dates (date, reason) VALUES (?, ?)').run(date, reason || null);
    const blocked = db.prepare('SELECT * FROM blocked_dates WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(blocked);
  } catch {
    res.status(409).json({ error: 'Date is already blocked' });
  }
}

export function removeBlockedDate(req: Request, res: Response) {
  const result = db.prepare('DELETE FROM blocked_dates WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Blocked date not found' });
    return;
  }
  res.json({ message: 'Blocked date removed' });
}
