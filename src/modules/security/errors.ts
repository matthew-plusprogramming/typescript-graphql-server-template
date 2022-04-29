import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum SecurityErrorMessages {
  QUERY_TOO_COMPLEX = 'Too complicated query',
  RATE_LIMIT_EXCEEDED = 'Rate limit exceeded',
  UNKNOWN_SECURITY_ERROR = 'An unknown security error occured'
}

@ObjectType()
export class QueryTooComplexError extends GraphQLError
  implements GraphQLFormattedError {
  @Field({ complexity: 1 })
    message: string = SecurityErrorMessages.QUERY_TOO_COMPLEX;

  constructor() { super(SecurityErrorMessages.QUERY_TOO_COMPLEX); }
}

@ObjectType()
export class RateLimitExceededError extends GraphQLError
  implements GraphQLFormattedError {
  @Field({ complexity: 1 })
    message: string = SecurityErrorMessages.RATE_LIMIT_EXCEEDED;

  constructor() { super(SecurityErrorMessages.RATE_LIMIT_EXCEEDED); }
}

@ObjectType()
export class UnknownSecurityError extends GraphQLError
  implements GraphQLFormattedError {
  @Field({ complexity: 1 })
    message: string = SecurityErrorMessages.UNKNOWN_SECURITY_ERROR;

  constructor() { super(SecurityErrorMessages.UNKNOWN_SECURITY_ERROR); }
}
