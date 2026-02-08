import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_CREDENTIALS, JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js';

export function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.json({ token, expiresIn: 86400 });
}
