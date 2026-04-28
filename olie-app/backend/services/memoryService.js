import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoryFile = path.join(__dirname, '..', 'memory', 'memory.json');

const MAX_CONVERSATIONS = 100;
const MAX_TRAINING_LOGS = 180;

async function readMemory() {
  const raw = await fs.readFile(memoryFile, 'utf-8');
  return JSON.parse(raw);
}

async function writeMemory(memory) {
  await fs.writeFile(memoryFile, JSON.stringify(memory, null, 2), 'utf-8');
}

export async function getMemory() {
  return readMemory();
}

export async function mergeMemory(update) {
  const current = await readMemory();
  const next = {
    ...current,
    ...update,
    profile: {
      ...current.profile,
      ...(update.profile || {})
    }
  };

  if (Array.isArray(update.trainingLogs)) {
    next.trainingLogs = [...current.trainingLogs, ...update.trainingLogs].slice(-MAX_TRAINING_LOGS);
  }

  if (Array.isArray(update.conversations)) {
    next.conversations = [...current.conversations, ...update.conversations].slice(-MAX_CONVERSATIONS);
  }

  await writeMemory(next);
  return next;
}

export async function appendConversation(role, message, meta = {}) {
  const memory = await readMemory();
  const item = {
    role,
    message,
    meta,
    timestamp: new Date().toISOString()
  };

  memory.conversations = [...memory.conversations, item].slice(-MAX_CONVERSATIONS);
  await writeMemory(memory);
  return item;
}

export async function appendTrainingLog(log) {
  const memory = await readMemory();
  const withTimestamp = {
    ...log,
    timestamp: log.timestamp || new Date().toISOString()
  };
  memory.trainingLogs = [...memory.trainingLogs, withTimestamp].slice(-MAX_TRAINING_LOGS);
  await writeMemory(memory);
  return withTimestamp;
}
