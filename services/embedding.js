const DIMENSIONS = 384;

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function hashToken(token) {
  let hash = 0;
  for (let i = 0; i < token.length; i += 1) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function createEmbedding(text) {
  const vector = new Array(DIMENSIONS).fill(0);
  const tokens = tokenize(text);
  if (!tokens.length) {
    return vector;
  }

  for (const token of tokens) {
    const index = hashToken(token) % DIMENSIONS;
    vector[index] += 1;
  }

  const norm = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  if (!norm) {
    return vector;
  }

  return vector.map((value) => value / norm);
}

function cosineSimilarity(a, b) {
  let sum = 0;
  for (let i = 0; i < DIMENSIONS; i += 1) {
    sum += (a[i] || 0) * (b[i] || 0);
  }
  return sum;
}

module.exports = {
  createEmbedding,
  cosineSimilarity
};
