import { Router } from 'express';
import { getWeather } from '../services/weatherService.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const weather = await getWeather();
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

export default router;
