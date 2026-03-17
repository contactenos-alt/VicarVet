const OpenAI = require("openai");

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const INSUFFICIENT_INFO_MESSAGE = "No tengo información suficiente para responder con precisión.";

function buildContext(docs) {
  return docs
    .map((doc, index) => `Fuente ${index + 1}: ${doc.source}\nContenido: ${doc.content}`)
    .join("\n\n");
}

function fallbackAnswer(docs) {
  if (!docs.length) {
    return INSUFFICIENT_INFO_MESSAGE;
  }

  const best = docs[0];
  return `Según la información disponible en ${best.source}: ${best.content}`;
}

async function generateGroundedAnswer(question, docs) {
  if (!docs.length) {
    return INSUFFICIENT_INFO_MESSAGE;
  }

  if (!client) {
    return fallbackAnswer(docs);
  }

  const context = buildContext(docs);

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "Eres VicarVet, un asistente veterinario especializado en productos y conocimiento de Vicar. Tu única fuente de verdad es la información recuperada desde URLs del sitio web de Vicar y datos manuales proporcionados. Reglas obligatorias: 1) Usa SOLO la información del contexto recuperado. 2) NO inventes información. 3) NO uses conocimiento externo. 4) Si la respuesta no está en el contexto, responde exactamente: 'No tengo información suficiente para responder con precisión.'. 5) Prioriza información más relevante, más específica y de productos Vicar. 6) Responde de forma clara, profesional y concisa. 7) Si hay múltiples fuentes, combínalas solo si hablan del mismo tema y no asumas relaciones no explícitas. 8) Si hay conflicto entre fuentes, indica que hay información contradictoria. Formato de salida: respuesta directa y recomendación breve solo si aplica."
      },
      {
        role: "user",
        content: `CONTEXTO:\n${context}\n\nPREGUNTA:\n${question}\n\nRESPUESTA:`
      }
    ]
  });

  return response.choices?.[0]?.message?.content?.trim() || INSUFFICIENT_INFO_MESSAGE;
}

module.exports = {
  generateGroundedAnswer
};
