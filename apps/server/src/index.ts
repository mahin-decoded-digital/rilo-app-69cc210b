import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './lib/db';
import notesRouter from './routes/notes';

const isProd = process.env.PROD === 'true';
console.log('[server] Environment:');
console.log('  PROD:', isProd ? '✓ true' : '✗ false (in-memory storage)');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✓ configured' : '✗ not set');
if (isProd && !process.env.MONGODB_URI) {
  console.warn('[server] ⚠ PROD=true but MONGODB_URI not set — falling back to in-memory!');
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[api] ${req.method} ${req.path} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: db.isProduction() ? 'mongodb' : 'in-memory' });
});

// Mount routes
app.use('/api/notes', notesRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[server] API server running on http://localhost:${PORT}`);
  console.log(`[server] DB mode: ${db.isProduction() ? 'MongoDB' : 'In-memory'}`);
});