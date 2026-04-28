const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function parseTrainingFromText(text) {
  const lower = text.toLowerCase();
  const sleepMatch = lower.match(/(\d+(?:[\.,]\d+)?)\s*h(?:oras?)?/);
  const energyMatch = lower.match(/energ(?:ía|ia)\s*(\d{1,2})/);

  return {
    sensation: lower.includes('pesado') || lower.includes('cansado') ? 'pesado' : '',
    sleepHours: sleepMatch ? toNumber(sleepMatch[1].replace(',', '.')) : null,
    energy: energyMatch ? toNumber(energyMatch[1]) : null
  };
}

export function analyzeTraining(input = {}, previousLogs = []) {
  const sleepHours = toNumber(input.sleepHours, 0);
  const energy = toNumber(input.energy, 6);
  const sets = toNumber(input.sets, 0);
  const reps = toNumber(input.reps, 0);
  const duration = toNumber(input.duration, 0);
  const sensation = (input.sensation || '').toLowerCase();

  let fatigueScore = 0;

  if (sleepHours > 0 && sleepHours < 6) fatigueScore += 3;
  if (energy > 0 && energy <= 4) fatigueScore += 3;
  if (sensation.includes('pesado') || sensation.includes('agotado')) fatigueScore += 2;
  if (duration > 90) fatigueScore += 2;
  if (sets * reps >= 100) fatigueScore += 1;

  const recentLowRecoveryDays = previousLogs
    .slice(-5)
    .filter((log) => toNumber(log.sleepHours, 8) < 6 || toNumber(log.energy, 7) <= 4).length;

  fatigueScore += recentLowRecoveryDays >= 2 ? 2 : 0;

  const level = fatigueScore >= 7 ? 'alta' : fatigueScore >= 4 ? 'media' : 'baja';

  const recommendation =
    level === 'alta'
      ? 'Mañana haz sesión de recuperación activa (20-30 min suave), movilidad y reduce el volumen de fuerza al 60%.'
      : level === 'media'
        ? 'Mantén el entrenamiento pero recorta 1-2 series por ejercicio principal y prioriza técnica + descanso.'
        : 'Puedes progresar carga de forma moderada (2.5-5%) manteniendo buena técnica.';

  return {
    fatigueScore,
    fatigueLevel: level,
    diagnosis:
      level === 'alta'
        ? 'Hay signos claros de fatiga acumulada y recuperación insuficiente.'
        : level === 'media'
          ? 'Existe fatiga moderada; conviene ajustar el volumen para sostener progreso.'
          : 'Tu recuperación luce estable para seguir progresando.',
    recommendation,
    adjustments: {
      nextDayFocus: level === 'alta' ? 'recuperación' : 'progresión controlada',
      sleepTarget: '7-9h',
      hydration: '35-45 ml/kg peso corporal'
    }
  };
}
