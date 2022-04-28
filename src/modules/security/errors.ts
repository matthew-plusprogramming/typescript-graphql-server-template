import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum SecurityErrorMessages {
  QUERY_TOO_COMPLEX = 'Too complicated query',
  RATE_LIMIT_EXCEEDED = 'Rate limite exceeded'
}

@ObjectType()
export class QueryTooComplexError extends GraphQLError
  implements GraphQLFormattedError {
  @Field({ complexity: 1 })
    message: string = SecurityErrorMessages.QUERY_TOO_COMPLEX;

  constructor() { super(SecurityErrorMessages.QUERY_TOO_COMPLEX); }
}
