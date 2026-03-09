import { ConnectionOptions } from 'bullmq';
import { env } from '../config/env';
import { InternalError } from '../utils/errorHandler';

export function getBullMqConnectionOptions(): ConnectionOptions {
  if (!env.REDIS_URL) {
    throw new InternalError('REDIS_URL is required for BullMQ');
  }

  const redisUrl = new URL(env.REDIS_URL);
  const dbPath = redisUrl.pathname.replace('/', '');

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    db: dbPath ? Number(dbPath) : undefined,
    tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null,
  };
}
