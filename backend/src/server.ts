import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

// Centralized env config — validates all env vars at startup
import { env } from './config/env';
import prisma from './config/database';

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

const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',')
  : [env.FRONTEND_URL];

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

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Plan-aware rate limiter
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ── Health Check ───────────────────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unreachable';
  }

  res.status(dbStatus === 'ok' ? 200 : 503).json({
    success: dbStatus === 'ok',
    message: 'CareerAI API is running',
    version: 'v1',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    services: { database: dbStatus },
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

let server: ReturnType<typeof app.listen> | null = null;

async function gracefulShutdown(signal: string) {
  console.log(`\n⏳ Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log('   ✅ HTTP server closed');
    });
  }

  try {
    await prisma.$disconnect();
    console.log('   ✅ Database disconnected');
  } catch (err) {
    console.error('   ❌ Error disconnecting database:', err);
  }

  process.exit(0);
}

if (require.main === module) {
  server = app.listen(env.PORT, () => {
    console.log(`
  🚀 CareerAI API Server
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 Port:        ${env.PORT}
  🌍 Environment: ${env.NODE_ENV}
  🔗 Health:      http://localhost:${env.PORT}/health
  📚 API v1:      http://localhost:${env.PORT}/api/v1
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
}

// ── Graceful Shutdown ──────────────────────────────────────────────────────

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

export default app;

