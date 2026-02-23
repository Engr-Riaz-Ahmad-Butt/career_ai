import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import resumeRoutes from './routes/resume.routes';
import documentRoutes from './routes/document.routes';
import aiRoutes from './routes/ai.routes';
import dashboardRoutes from './routes/dashboard.routes';
import interviewRoutes from './routes/interview.routes';
import billingRoutes from './routes/billing.routes';
import creditsRoutes from './routes/credits.routes';
import templatesRoutes from './routes/templates.routes';
import portfolioRoutes from './routes/portfolio.routes';
import adminRoutes from './routes/admin.routes';
import analyzeRoutes from './routes/analyze.routes';

// Middleware
import { errorHandler, notFound } from './middleware/error';

const app: Application = express();

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL || 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy: This origin is not allowed'), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Raw body parser for Stripe webhooks BEFORE json parser
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Plan-aware rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ── Health Check ───────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CareerAI API is running',
    version: 'v1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API v1 Routes ──────────────────────────────────────────────────────────

const v1 = '/api/v1';

app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/users`, userRoutes);
app.use(`${v1}/resumes`, resumeRoutes);
app.use(`${v1}/documents`, documentRoutes);
app.use(`${v1}/ai`, aiRoutes);
app.use(`${v1}/dashboard`, dashboardRoutes);
app.use(`${v1}/interview`, interviewRoutes);
app.use(`${v1}/billing`, billingRoutes);
app.use(`${v1}/credits`, creditsRoutes);
app.use(`${v1}/templates`, templatesRoutes);
app.use(`${v1}/portfolio`, portfolioRoutes);
app.use(`${v1}/admin`, adminRoutes);
app.use(`${v1}/analyze`, analyzeRoutes);

// Backwards compatibility alias (old /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// ── Error Handling ─────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
  🚀 CareerAI API Server
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 Port:        ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 Health:      http://localhost:${PORT}/health
  📚 API v1:      http://localhost:${PORT}/api/v1
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
}

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;
