import { Router } from 'express';
import { appendConversation, appendTrainingLog, getMemory } from '../services/memoryService.js';
import { generateOlieResponse } from '../services/aiService.js';
import { getWeather } from '../services/weatherService.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message es requerido' });
    }

    const memory = await getMemory();
    const weather = await getWeather();
    const localTime = new Date().toLocaleString('es-ES', {
      timeZone: memory.profile?.timezone || 'America/New_York',
      hour12: false
    });

    await appendConversation('user', message);

    const generated = await generateOlieResponse(message, memory, {
      weather,
      localTime,
      profile: memory.profile
    });

    if (generated.parsedTraining && (generated.parsedTraining.sleepHours || generated.parsedTraining.energy || generated.parsedTraining.sensation)) {
      await appendTrainingLog(generated.parsedTraining);
    }

    await appendConversation('assistant', generated.reply, { analysis: generated.analysis });

    return res.json({
      reply: generated.reply,
      analysis: generated.analysis,
      weather,
      localTime
    });
  } catch (error) {
    next(error);
  }
});

export default router;
