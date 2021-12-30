import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum LoginErrorMessages {
  INCORRECT_LOGIN_CREDENTIALS = 'Login credentials are incorrect',
  EMAIL_NOT_CONFIRMED = 'Your email has not been confirmed'
}

@ObjectType()
export class IncorrectLoginCredentialsError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
  message: string = LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS;

  constructor() { super(LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS); }
}

@ObjectType()
export class EmailNotConfirmedError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
  message: string = LoginErrorMessages.EMAIL_NOT_CONFIRMED;

  constructor() { super(LoginErrorMessages.EMAIL_NOT_CONFIRMED); }
}
