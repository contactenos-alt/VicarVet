# VetGPT · Vicar

Aplicación web con arquitectura RAG para responder preguntas veterinarias usando contenido del sitio de Vicar y conocimiento manual.

## Requisitos

- Node.js 18+

## Ejecutar

```bash
npm install
npm start
```

Abre `http://localhost:3000`.

## Fuentes de productos veterinarios

Las URLs de productos y categorías veterinarias usadas para responder preguntas de portafolio están centralizadas en `services/productUrls.js`.

## Endpoints

- `POST /api/ask` → `{ question: string }`
- `POST /api/ingest` → fuerza una nueva ingesta de fuentes
- `GET /api/health`

## Actualizar base de conocimiento manual


La base manual ahora incluye directorio comercial por ciudad/distrito para consultas de compra, contacto y WhatsApp.

Después de cambios en `services/config.js`, ejecuta una nueva ingesta para refrescar la base vectorial:

```bash
curl -X POST http://localhost:3000/api/ingest
```

## Variables opcionales

- `OPENAI_API_KEY` para generación de respuesta con GPT.
- `OPENAI_MODEL` (por defecto `gpt-4o-mini`).

Si no hay API key, VetGPT usa una respuesta extractiva basada en los fragmentos recuperados.
