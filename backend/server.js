import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { connectDB } from './utils/db.js';
import mongoose from 'mongoose';
import { validateEnv } from './config/validateEnv.js';

dotenv.config();

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
// helmet sets a sensible baseline of HTTP security headers (CSP, HSTS, etc.)
// without any bespoke configuration required.
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
// Restrict cross-origin requests to known origins in production.
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : '*';

app.use(cors({ origin: allowedOrigins }));

// ── Request logging ───────────────────────────────────────────────────────────
// Use 'combined' format in production for full Apache-style logs
// and 'dev' in development for concise coloured output.
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // hard limit prevents large payload attacks
app.use(express.urlencoded({ extended: true }));

// ── Global rate limit ────────────────────────────────────────────────────────
// Applied here so it wraps every route. Auth endpoints get a stricter
// limiter applied directly on the route (see routes/auth.js).
app.use('/api', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Smart Inbox Backend Running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Validate environment early
    const { errors, warnings } = validateEnv(process.env);
    if (warnings.length) {
      warnings.forEach(w => console.warn('⚠️  Env warning:', w));
    }
    if (errors.length) {
      errors.forEach(e => console.error('❌ Env error:', e));
      throw new Error('Environment validation failed');
    }

    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
