import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { DocumentNode } from 'graphql';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';
import { AuthContext } from '~types/AuthContext';
import { env } from './config';
import { QueryTooComplexError } from './modules/security/errors';
import { redis } from './redis';

export enum RateLimitPrefixes {
  TotalComplexityByUserID = 'rate-limit-by-total-complexity-by-user-id',
  TotalComplexityByIP = 'rate-limit-by-total-complexity-by-ip',
  CountByUserID = 'rate-limit-count-by-user-id',
  CountByIP = 'rate-limit-count-by-ip',
}
export const RedisKeyComponentDelimiter = '=';


export const RateLimitPlugin: ApolloServerPlugin = {
  requestDidStart: () => new Promise((resolve) => resolve({
    didResolveOperation(requestContext) {
      return new Promise((resolve) => {
        const { request, document, schema } = requestContext;
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 })
          ]
        });
        if (complexity > parseInt(env.MAX_QUERY_COMPLEXITY)) {
          throw new QueryTooComplexError();
        }
        resolve();
      });
    },
    willSendResponse(requestContext) {
      return new Promise((resolve) => {
        const { request, document, context, schema } = requestContext;
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document as DocumentNode,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 })
          ]
        });
        // Update total query complexity for rate limit
        const redisOperation = redis.multi();
        if (context.authContext) {
          const transformedContext = context as AuthContext;
          if (transformedContext.authContext.userToken) {
            const rateLimitByUserIDKey = `${RateLimitPrefixes.TotalComplexityByUserID}${RedisKeyComponentDelimiter}${transformedContext.authContext.userToken.sub}`;
            redisOperation
              .incrby(rateLimitByUserIDKey, complexity)
              .expire(rateLimitByUserIDKey, env.QUERY_COMPLEXITY_RATE_LIMIT_BY_USER_ID_TIMEFRAME_SECONDS, 'NX');
          }
        }
        const rateLimitByIPKey = `${RateLimitPrefixes.TotalComplexityByIP}${RedisKeyComponentDelimiter}${context.ip}`;
        redisOperation
          .incrby(rateLimitByIPKey, complexity)
          .expire(rateLimitByIPKey, env.QUERY_COMPLEXITY_RATE_LIMIT_BY_IP_TIMEFRAME_SECONDS, 'NX')
          .exec();

        resolve();
      });
    }
  }))
};
