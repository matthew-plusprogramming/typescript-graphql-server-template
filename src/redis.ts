import RedisClient from 'ioredis';

export const redis = new RedisClient();

export const stopRedis = (): void => redis.disconnect();
