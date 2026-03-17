const { createEmbedding, cosineSimilarity } = require("./embedding");
const vectorStore = require("./vectorStore");

function retrieveRelevantDocuments(question, topK = 4) {
  const queryEmbedding = createEmbedding(question);
  const docs = vectorStore.getDocuments();

  const scored = docs
    .map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((doc) => doc.score > 0.05);

  return scored;
}

module.exports = {
  retrieveRelevantDocuments
};
