import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum AuthErrorMessages {
  UNAUTHORIZED = 'Access denied, you need to be authorized to perform this action',
  UNKNOWN_ERROR = 'An unknown auth error occurred'
}

@ObjectType()
export class UnauthorizedError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
  message: string = AuthErrorMessages.UNAUTHORIZED;

  extensions = {
    code: 401
  }

  constructor() { super(AuthErrorMessages.UNAUTHORIZED); }
}

@ObjectType()
export class UnknownAuthError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
  message: string = AuthErrorMessages.UNKNOWN_ERROR;

  constructor() { super(AuthErrorMessages.UNKNOWN_ERROR); }
}
