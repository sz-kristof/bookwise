import { Router } from 'express';
import { getWeeklySchedule, updateWeeklySchedule, getSlots, getBlockedDates, addBlockedDate, removeBlockedDate } from '../controllers/availability.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const scheduleSchema = z.object({
  schedule: z.array(z.object({
    day_of_week: z.number().int().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}$/),
    is_active: z.boolean(),
  })),
});

const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(200).optional(),
});

router.get('/', getWeeklySchedule);
router.put('/', requireAuth, validate(scheduleSchema), updateWeeklySchedule);
router.get('/slots', getSlots);
router.get('/blocked-dates', requireAuth, getBlockedDates);
router.post('/blocked-dates', requireAuth, validate(blockedDateSchema), addBlockedDate);
router.delete('/blocked-dates/:id', requireAuth, removeBlockedDate);

export default router;
