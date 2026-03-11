import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

// Centralized env config — validates all env vars at startup
import { env } from '@/config/env';
import prisma from '@/config/database';

// Routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import profileRoutes from '@/routes/profile.routes';
import resumeRoutes from '@/routes/resume.routes';
import documentRoutes from '@/routes/document.routes';
import aiRoutes from '@/routes/ai.routes';
import dashboardRoutes from '@/routes/dashboard.routes';
import interviewRoutes from '@/routes/interview.routes';
import billingRoutes from '@/routes/billing.routes';
import creditsRoutes from '@/routes/credits.routes';
import templatesRoutes from '@/routes/templates.routes';
import portfolioRoutes from '@/features/portfolio/portfolio.routes';
import adminRoutes from '@/routes/admin.routes';
import analyzeRoutes from '@/routes/analyze.routes';
import streamRoutes from '@/routes/stream.routes';
import jobRoutes from '@/routes/job.routes';

// Middleware
import { errorHandler, notFound } from '@/middleware/error';
import { performanceMonitor } from '@/middleware/performanceMonitor';
import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import { sanitizeInput } from '@/middleware/sanitizeInput';
import { startJobWorker, stopJobWorker } from '@/workers/job.worker';
import { getJobQueueService } from '@/services/jobQueue.service';
import { logger } from '@/utils/logger';

const app: Application = express();

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(helmet());
app.use(requestIdMiddleware);
app.use(performanceMonitor);

const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [env.FRONTEND_URL];

const allowNoOriginRequests = env.CORS_ALLOW_NO_ORIGIN || env.NODE_ENV !== 'production';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        if (allowNoOriginRequests) {
          return callback(null, true);
        }
        return callback(new Error('CORS policy: Missing origin header'), false);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy: This origin is not allowed'), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id', 'X-Response-Time-Ms', 'X-First-Byte-Ms'],
    maxAge: 600,
    credentials: true,
  })
);

// Raw body parser for Stripe webhooks BEFORE json parser
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);
app.use(cookieParser());
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
app.use(`${v1}/user`, userRoutes);
app.use(`${v1}/profile`, profileRoutes);
app.use(`${v1}/resumes`, resumeRoutes);
app.use(`${v1}/resume`, resumeRoutes);
app.use(`${v1}/documents`, documentRoutes);
app.use(`${v1}/document`, documentRoutes);
app.use(`${v1}/ai`, aiRoutes);
app.use(`${v1}/dashboard`, dashboardRoutes);
app.use(`${v1}/interview`, interviewRoutes);
app.use(`${v1}/billing`, billingRoutes);
app.use(`${v1}/credits`, creditsRoutes);
app.use(`${v1}/templates`, templatesRoutes);
app.use(`${v1}/portfolio`, portfolioRoutes);
app.use(`${v1}/admin`, adminRoutes);
app.use(`${v1}/analyze`, analyzeRoutes);
app.use(`${v1}/stream`, streamRoutes);
app.use(`${v1}/jobs`, jobRoutes);
app.use(`${v1}/job`, jobRoutes);

// Backwards compatibility alias (old /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/ai', aiRoutes);

// ── Error Handling ─────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────

let server: ReturnType<typeof app.listen> | null = null;
let embeddedWorkerStarted = false;

async function gracefulShutdown(signal: string) {
  logger.info('Graceful shutdown initiated', { signal });

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
    });
  }

  try {
    if (embeddedWorkerStarted) {
      await stopJobWorker();
      logger.info('Embedded job worker stopped');
    }
  } catch (err) {
    logger.error('Error stopping job worker', { err });
  }

  try {
    await getJobQueueService().close();
    logger.info('Job queue connection closed');
  } catch (err) {
    logger.error('Error closing job queue connection', { err });
  }

  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (err) {
    logger.error('Error disconnecting database', { err });
  }

  process.exit(0);
}

if (require.main === module) {
  const shouldStartEmbeddedWorker =
    Boolean(env.REDIS_URL) && env.ENABLE_EMBEDDED_WORKER === 'true';

  if (shouldStartEmbeddedWorker) {
    const worker = startJobWorker();
    embeddedWorkerStarted = Boolean(worker);
  }

  server = app.listen(env.PORT, () => {
    logger.info('CareerAI API server started', {
      port: env.PORT,
      environment: env.NODE_ENV,
      healthUrl: `http://localhost:${env.PORT}/health`,
      apiBaseUrl: `http://localhost:${env.PORT}/api/v1`,
      workerMode: shouldStartEmbeddedWorker ? 'embedded' : 'external/off',
    });
  });
}

// ── Graceful Shutdown ──────────────────────────────────────────────────────

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled promise rejection', { err });
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception', { err });
  gracefulShutdown('uncaughtException');
});

export default app;

