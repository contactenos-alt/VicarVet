import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, app: 'olie-backend' });
});

app.use('/chat', chatRoutes);
app.use('/memory', memoryRoutes);
app.use('/weather', weatherRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor', details: error.message });
});

app.listen(port, () => {
  console.log(`Olie backend escuchando en http://localhost:${port}`);
});
