import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { RegisterErrorMessages } from './errors';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  username!: string;

  @Field()
  @Length(1, 255)
  firstName!: string;

  @Field()
  @Length(1, 255)
  lastName!: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: RegisterErrorMessages.EMAIL_ALREADY_IN_USE })
  email!: string;

  @Field()
  password!: string;
}
