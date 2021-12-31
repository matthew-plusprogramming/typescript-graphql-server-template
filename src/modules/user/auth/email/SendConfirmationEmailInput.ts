import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailForUnconfirmedUser } from './IsEmailForUnconfirmedUser';

@InputType()
export class SendConfirmationEmailInput {
  @Field()
  @IsEmail()
  @IsEmailForUnconfirmedUser()
  email!: string;
}
