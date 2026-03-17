require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const vectorStore = require("./services/vectorStore");
const { runFullIngestion } = require("./services/ingestion");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", chatRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "VetGPT" });
});

app.post("/api/ingest", async (req, res) => {
  try {
    const result = await runFullIngestion();
    return res.json({ message: "Ingesta completada", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  vectorStore.loadStore();
  if (!vectorStore.getDocuments().length) {
    await runFullIngestion();
  }

  app.listen(PORT, () => {
    console.log(`VetGPT listening on http://localhost:${PORT}`);
  });
}

start();
