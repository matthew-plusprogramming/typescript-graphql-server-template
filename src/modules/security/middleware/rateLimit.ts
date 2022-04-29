import { createMethodDecorator, MiddlewareFn } from 'type-graphql';
import { env } from '~/config';
import { RateLimitPrefixes, RedisKeyComponentDelimiter } from '~/rateLimitPlugin';
import { redis } from '~/redis';
import { AuthContext } from '~types/AuthContext';
import { RateLimitExceededError, UnknownSecurityError } from '../errors';

export const CountRateLimitByIP = (
  rateLimit: number,
  timeFrameSeconds: number
): MethodDecorator =>
  createMethodDecorator<AuthContext>(async ({ context, info }, next) => {
    if (context.ip) {
      const rateLimitByIPKey = `${RateLimitPrefixes.CountByIP}${RedisKeyComponentDelimiter}${info.fieldNodes[ 0 ].name.value}${RedisKeyComponentDelimiter}${context.ip}`;
      const currentUsage = await redis.get(rateLimitByIPKey);
      if (currentUsage && parseInt(currentUsage) >= rateLimit) {
        throw new RateLimitExceededError();
      }

      redis
        .multi()
        .incr(rateLimitByIPKey)
        .expire(rateLimitByIPKey, timeFrameSeconds, 'NX')
        .exec();
    }
    else {
      throw new UnknownSecurityError();
    }
    return next();
  });
// This middleware can only be applied after an isAuth middleware
export const CountRateLimitByUserID = (
  rateLimit: number,
  timeFrameSeconds: number
): MethodDecorator =>
  createMethodDecorator<AuthContext>(async ({ context, info }, next) => {
    if (context.authContext.userToken) {
      const rateLimitByUserIDKey = `${RateLimitPrefixes.CountByUserID}${RedisKeyComponentDelimiter}${info.fieldNodes[ 0 ].name.value}${RedisKeyComponentDelimiter}${context.authContext.userToken.sub}`;
      const currentUsage = await redis.get(rateLimitByUserIDKey);
      if (currentUsage && parseInt(currentUsage) >= rateLimit) {
        throw new RateLimitExceededError();
      }

      redis
        .multi()
        .incr(rateLimitByUserIDKey)
        .expire(rateLimitByUserIDKey, timeFrameSeconds, 'NX')
        .exec();
    }
    return next();
  });

export const TotalComplexityRateLimitByIP: MiddlewareFn<AuthContext> = async ({ context }, next) => {
  if (context.ip) {
    const rateLimitByIPKey = `${RateLimitPrefixes.TotalComplexityByIP}${RedisKeyComponentDelimiter}${context.ip}`;
    const currentUsage = await redis.get(rateLimitByIPKey);
    if (currentUsage && parseInt(currentUsage) > parseInt(env.QUERY_COMPLEXITY_RATE_LIMIT_BY_IP_VALUE)) {
      throw new RateLimitExceededError();
    }
  }
  else {
    throw new UnknownSecurityError();
  }
  return next();
};

// This middleware can only be applied after an isAuth middleware
export const TotalComplexityRateLimitByUserID: MiddlewareFn<AuthContext> = async ({ context }, next) => {
  if (context.authContext.userToken) {
    const rateLimitByUserIDKey = `${RateLimitPrefixes.TotalComplexityByUserID}${RedisKeyComponentDelimiter}${context.authContext.userToken.sub}`;
    const currentUsage = await redis.get(rateLimitByUserIDKey);
    if (currentUsage && parseInt(currentUsage) > parseInt(env.QUERY_COMPLEXITY_RATE_LIMIT_BY_USER_ID_VALUE)) {
      throw new RateLimitExceededError();
    }
  }
  else {
    throw new UnknownSecurityError();
  }
  return next();
};
