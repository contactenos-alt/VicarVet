const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "vector_store.json");

let documents = [];

function ensureStoreFile() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ documents: [] }, null, 2), "utf8");
  }
}

function loadStore() {
  ensureStoreFile();
  const raw = fs.readFileSync(STORE_PATH, "utf8");
  const parsed = JSON.parse(raw);
  documents = parsed.documents || [];
}

function saveStore() {
  fs.writeFileSync(STORE_PATH, JSON.stringify({ documents }, null, 2), "utf8");
}

function resetStore() {
  documents = [];
}

function addDocuments(newDocs) {
  documents.push(...newDocs);
}

function getDocuments() {
  return documents;
}

module.exports = {
  loadStore,
  saveStore,
  resetStore,
  addDocuments,
  getDocuments
};
