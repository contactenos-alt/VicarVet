const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener respuesta de Olie');
  }

  return response.json();
}

export async function getMemory() {
  const response = await fetch(`${API_BASE_URL}/memory`);
  if (!response.ok) throw new Error('No se pudo obtener memoria');
  return response.json();
}
