import { Router } from 'express';
import { getMemory, mergeMemory } from '../services/memoryService.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getMemory());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const updated = await mergeMemory(req.body || {});
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
