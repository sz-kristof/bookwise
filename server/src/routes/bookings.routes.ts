import { Router } from 'express';
import { getAllBookings, getBookingById, createBooking, updateBookingStatus, deleteBooking } from '../controllers/bookings.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createBookingSchema = z.object({
  serviceId: z.number().int().positive(),
  clientName: z.string().min(1).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().max(20).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(500).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed']),
});

router.get('/', requireAuth, getAllBookings);
router.get('/:id', requireAuth, getBookingById);
router.post('/', validate(createBookingSchema), createBooking);
router.patch('/:id/status', requireAuth, validate(updateStatusSchema), updateBookingStatus);
router.delete('/:id', requireAuth, deleteBooking);

export default router;
