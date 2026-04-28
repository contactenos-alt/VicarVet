import { analyzeTraining, parseTrainingFromText } from './trainingAnalyzer.js';

function buildSystemPrompt(context) {
  return [
    'Eres Olie: asistente personal que no responde, optimiza.',
    'Siempre entrega: diagnóstico, recomendación concreta y ajustes accionables.',
    `Perfil: ${JSON.stringify(context.profile)}`,
    `Clima actual: ${JSON.stringify(context.weather)}`,
    `Hora local aproximada: ${context.localTime}`
  ].join('\n');
}

async function callOpenAI(systemPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

function buildFallbackResponse(message, memory, context) {
  const parsed = parseTrainingFromText(message);
  const analysis = analyzeTraining(parsed, memory.trainingLogs);

  return {
    reply: [
      `Diagnóstico: ${analysis.diagnosis}`,
      `Recomendación: ${analysis.recommendation}`,
      `Ajustes: foco=${analysis.adjustments.nextDayFocus}, sueño=${analysis.adjustments.sleepTarget}, hidratación=${analysis.adjustments.hydration}.`,
      context.weather?.condition?.includes('rain') ? 'Extra: está lloviendo, prioriza cardio indoor o movilidad en casa.' : 'Extra: clima favorable para actividad exterior suave.'
    ].join('\n'),
    analysis,
    parsedTraining: parsed
  };
}

export async function generateOlieResponse(message, memory, context) {
  const systemPrompt = buildSystemPrompt(context);
  const aiText = await callOpenAI(systemPrompt, message);

  if (aiText) {
    return {
      reply: aiText,
      analysis: null,
      parsedTraining: parseTrainingFromText(message)
    };
  }

  return buildFallbackResponse(message, memory, context);
}
