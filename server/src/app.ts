import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { httpLoggerStream } from './config/logger';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app: Application = express();

// ------------------------------------------------------------------
// Security middleware
// ------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(globalRateLimiter);

// ------------------------------------------------------------------
// Body parsing
// ------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ------------------------------------------------------------------
// HTTP request logging (routed through winston)
// ------------------------------------------------------------------
app.use(morgan(env.isDevelopment ? 'dev' : 'combined', { stream: httpLoggerStream }));

// ------------------------------------------------------------------
// API routes
// ------------------------------------------------------------------
app.use(env.apiPrefix, routes);

// ------------------------------------------------------------------
// 404 + centralized error handling (must be registered last)
// ------------------------------------------------------------------
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
