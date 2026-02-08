import type { Request, Response } from 'express';
import db from '../config/database.js';
import type { Service } from '../types/index.js';

export function getAllServices(_req: Request, res: Response) {
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY name').all();
  res.json(services);
}

export function getServiceById(req: Request, res: Response) {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id) as Service | undefined;
  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  res.json(service);
}

export function createService(req: Request, res: Response) {
  const { name, description, duration, price, color } = req.body;
  const result = db.prepare(
    'INSERT INTO services (name, description, duration, price, color) VALUES (?, ?, ?, ?, ?)'
  ).run(name, description || null, duration, price, color || '#3B82F6');

  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(service);
}

export function updateService(req: Request, res: Response) {
  const { name, description, duration, price, color, is_active } = req.body;
  const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id) as Service | undefined;

  if (!existing) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  db.prepare(
    `UPDATE services SET name = ?, description = ?, duration = ?, price = ?, color = ?, is_active = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(
    name ?? existing.name,
    description ?? existing.description,
    duration ?? existing.duration,
    price ?? existing.price,
    color ?? existing.color,
    is_active ?? existing.is_active,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function deleteService(req: Request, res: Response) {
  const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  db.prepare("UPDATE services SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ message: 'Service deactivated' });
}
