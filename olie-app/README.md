# Olie — Asistente conversacional local

Olie es un asistente personal tipo Jarvis orientado a memoria persistente, análisis de entrenamiento y decisiones accionables.

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Capacitor (Android)
- **Backend:** Node.js + Express
- **IA:** OpenAI (opcional, fallback local inteligente si no hay API key)
- **Persistencia:** JSON local (`backend/memory/memory.json`)

## Estructura

```
/olie-app
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── services/
│   ├── memory/
│   └── db/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── capacitor.config.ts
│   └── android/ (se genera con npx cap add android)
└── README.md
```

## Configuración local (web)

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Variables `.env`:

- `OPENAI_API_KEY` (opcional)
- `WEATHER_API_KEY` (opcional, OpenWeatherMap)
- `WEATHER_CITY`, `WEATHER_COUNTRY`

Si no hay claves, Olie sigue funcionando con:
- análisis de fatiga local
- clima mock

### 2) Frontend

```bash
cd frontend
cp .env.example .env
# para web local puedes usar:
# VITE_API_BASE_URL=http://localhost:3001
npm install
npm run dev
```

La app quedará en `http://localhost:5173` y consume backend con `VITE_API_BASE_URL`.

## Build APK (Capacitor) local

> Para APK el backend **no puede** estar en `localhost` del PC. Debe ser una URL pública (o IP accesible desde el dispositivo).

```bash
cd frontend
cp .env.example .env
# ajusta VITE_API_BASE_URL=https://tu-backend-publico.com
npm install
npm run build:mobile
npx cap add android   # solo la primera vez
npm run cap:sync
cd android
./gradlew assembleRelease
```

APK esperado en:

`frontend/android/app/build/outputs/apk/release/app-release.apk`

## Build APK en Codemagic

Se agregó `codemagic.yaml` en la raíz del repo con workflow `olie-android-apk`.

### Pasos en Codemagic

1. Conecta el repo.
2. Selecciona `codemagic.yaml`.
3. En variables de entorno de Codemagic define:
   - `VITE_API_BASE_URL` apuntando a tu backend público.
4. Ejecuta workflow `olie-android-apk`.
5. Descarga artifact `.apk`.

## Endpoints

- `POST /chat` → recibe `{ message }` y devuelve análisis + respuesta
- `GET /memory` → memoria persistente actual
- `POST /memory` → merge de nueva memoria
- `GET /weather` → clima actual (real o mock)

## Primera prueba sugerida

Mensaje:

> Hoy entrené pierna, me sentí pesado, dormí 5h

Respuesta esperada:
- diagnóstico de fatiga
- recomendación concreta para el día siguiente
- ajustes accionables

## Diseño de Olie

- No respuestas genéricas
- Prioriza utilidad
- Usa contexto del usuario y entorno
- Respuesta en formato: diagnóstico + recomendación + ajustes

**Frase clave:** _"Olie no responde, optimiza."_
