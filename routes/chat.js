const express = require("express");
const { retrieveRelevantDocuments } = require("../services/retrieval");
const { generateGroundedAnswer } = require("../services/llm");

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { question } = req.body || {};

  if (!question || question.trim().length < 4) {
    return res.status(400).json({
      error: "La pregunta es obligatoria y debe tener al menos 4 caracteres."
    });
  }

  try {
    const documents = retrieveRelevantDocuments(question, 4);
    const answer = await generateGroundedAnswer(question, documents);

    return res.json({
      answer,
      sources: documents.map((doc) => ({
        source: doc.source,
        score: Number(doc.score.toFixed(3)),
        metadata: doc.metadata
      }))
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo generar la respuesta en este momento.",
      details: error.message
    });
  }
});

module.exports = router;
