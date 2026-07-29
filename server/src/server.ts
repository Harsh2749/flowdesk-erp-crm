import { Server } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/prisma';

let server: Server;

async function bootstrap(): Promise<void> {
  await connectDatabase();

  server = app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    logger.info(`API base path: ${env.apiPrefix}`);
  });
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server?.close(async () => {
    await disconnectDatabase();
    logger.info('Server closed. Process exiting.');
    process.exit(0);
  });

  // Force-exit if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.stack ?? error.message}`);
  process.exit(1);
});

bootstrap().catch((error) => {
  logger.error(`Failed to start server: ${error}`);
  process.exit(1);
});
