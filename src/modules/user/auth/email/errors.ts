import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

export enum EmailErrorMessages {
  EMAIL_FAILED_TO_SEND = 'Email failed to send'
}

@ObjectType()
export class EmailFailedToSendError extends GraphQLError
  implements GraphQLFormattedError {
  @Field()
    message: string = EmailErrorMessages.EMAIL_FAILED_TO_SEND;

  constructor() { super(EmailErrorMessages.EMAIL_FAILED_TO_SEND); }
}
