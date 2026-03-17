const axios = require("axios");
const cheerio = require("cheerio");
const { URL_SOURCES, MANUAL_SOURCES } = require("./config");
const { createEmbedding } = require("./embedding");
const vectorStore = require("./vectorStore");

function cleanHtmlToText(html) {
  const $ = cheerio.load(html);
  $("script, style, noscript, nav, header, footer, aside, form, iframe").remove();
  const rawText = $("main").text() || $("body").text() || "";
  return rawText.replace(/\s+/g, " ").trim();
}

function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize || 500;
  const overlap = options.overlap || 80;
  const chunks = [];

  if (!text) {
    return chunks;
  }

  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 40) {
      chunks.push(chunk);
    }
    start += chunkSize - overlap;
  }

  return chunks;
}

async function ingestUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        "User-Agent": "VetGPT-RAG-Bot/1.0"
      }
    });

    const text = cleanHtmlToText(response.data);
    const chunks = chunkText(text);

    return chunks.map((content, index) => ({
      id: `url-${Buffer.from(url).toString("base64")}-${index}`,
      content,
      embedding: createEmbedding(content),
      source: url,
      metadata: {
        type: "url",
        chunkIndex: index,
        ingestedAt: new Date().toISOString()
      }
    }));
  } catch (error) {
    return [
      {
        id: `url-failed-${Buffer.from(url).toString("base64")}`,
        content: `No fue posible indexar ${url} durante esta ejecución.`,
        embedding: createEmbedding("No fue posible indexar"),
        source: url,
        metadata: {
          type: "url",
          error: error.message,
          ingestedAt: new Date().toISOString()
        }
      }
    ];
  }
}

function ingestManualData() {
  return MANUAL_SOURCES.map((item, index) => {
    const content = `${item.title}. ${item.content}`;
    return {
      id: `manual-${index}`,
      content,
      embedding: createEmbedding(content),
      source: "manual",
      metadata: {
        type: "manual",
        title: item.title,
        ingestedAt: new Date().toISOString()
      }
    };
  });
}

async function runFullIngestion() {
  vectorStore.resetStore();

  const uniqueUrls = [...new Set(URL_SOURCES)];
  const urlDocumentsList = await Promise.all(uniqueUrls.map((url) => ingestUrl(url)));
  const urlDocuments = urlDocumentsList.flat();
  const manualDocuments = ingestManualData();

  vectorStore.addDocuments([...urlDocuments, ...manualDocuments]);
  vectorStore.saveStore();

  return {
    urlDocs: urlDocuments.length,
    manualDocs: manualDocuments.length,
    totalDocs: urlDocuments.length + manualDocuments.length
  };
}

module.exports = {
  runFullIngestion
};
