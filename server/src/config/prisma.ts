import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

/**
 * Prisma must only ever be instantiated once per process. In dev mode with
 * ts-node/nodemon hot-reloading, re-importing this module would otherwise
 * create a new client (and a new connection pool) on every reload, so we
 * cache the instance on the global object.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: env.isDevelopment
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ]
      : [{ emit: 'event', level: 'error' }],
  });

if (env.isDevelopment) {
  global.__prisma__ = prisma;
}

prisma.$on('error' as never, (e: unknown) => logger.error(`Prisma error: ${JSON.stringify(e)}`));

if (env.isDevelopment) {
  prisma.$on('query' as never, (e: { query: string; duration: number }) => {
    logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
  });
}

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  logger.info('Database connected successfully (Prisma + PostgreSQL)');
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('🔌 Database connection closed');
};
