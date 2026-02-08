import { Router } from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService } from '../controllers/services.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const serviceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().min(5).max(480),
  price: z.number().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', requireAuth, validate(serviceSchema), createService);
router.put('/:id', requireAuth, validate(serviceSchema.partial()), updateService);
router.delete('/:id', requireAuth, deleteService);

export default router;
