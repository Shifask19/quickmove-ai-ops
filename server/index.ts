import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSchema } from './schema.js';
import { seedDatabase } from './seed.js';
import { customersRouter } from './routes/customers.js';
import { relocationsRouter } from './routes/relocations.js';
import { tasksRouter } from './routes/tasks.js';
import { vendorsRouter } from './routes/vendors.js';
import { utilitiesRouter } from './routes/utilities.js';
import { miscRouter } from './routes/misc.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Middleware — allow any localhost in dev, locked in prod
const allowedOrigin = isProd
  ? process.env.CORS_ORIGIN || true
  : /^http:\/\/localhost:\d+$/;
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString().slice(11,19)} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/customers',    customersRouter);
app.use('/api/relocations',  relocationsRouter);
app.use('/api/tasks',        tasksRouter);
app.use('/api/vendors',      vendorsRouter);
app.use('/api/utilities',    utilitiesRouter);
app.use('/api',              miscRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'QuickMove API' });
});

// Init DB
createSchema();
seedDatabase();

// Serve built frontend in production (must be before 404 handler)
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  // Express 5 requires explicit wildcard syntax
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler (API routes only)
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 QuickMove API running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database: server/quickmove.db\n`);
});
