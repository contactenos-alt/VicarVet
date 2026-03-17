const vectorStore = require("../services/vectorStore");
const { runFullIngestion } = require("../services/ingestion");

(async () => {
  vectorStore.loadStore();
  const result = await runFullIngestion();
  console.log("Ingesta completada:", result);
})();
