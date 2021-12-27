import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum LoginErrorMessages {
  INCORRECT_LOGIN_CREDENTIALS = 'Login credentials are incorrect'
}

@ObjectType()
export class IncorrectLoginCredentialsError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
  message: string = LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS;

  constructor() { super(LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS); }
}
