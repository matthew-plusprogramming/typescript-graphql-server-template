import RedisClient, { RedisOptions } from 'ioredis';
import { env } from './config';

const redisOptions: RedisOptions = {
  host: env.REDIS_HOST || '127.0.0.1',
  port: parseInt(env.REDIS_PORT) || 6379,
  password: env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  }
};

export const redis = new RedisClient(redisOptions);

export const stopRedis = (): void => redis.disconnect();
