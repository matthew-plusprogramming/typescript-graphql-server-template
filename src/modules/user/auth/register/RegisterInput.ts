import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { RegisterErrorMessages } from './errors';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field({ complexity: 1 })
  @Length(1, 255)
    username!: string;

  @Field({ complexity: 1 })
  @Length(1, 255)
    firstName!: string;

  @Field({ complexity: 1 })
  @Length(1, 255)
    lastName!: string;

  @Field({ complexity: 1 })
  @IsEmail()
  @IsEmailAlreadyExist({ message: RegisterErrorMessages.EMAIL_ALREADY_IN_USE })
    email!: string;

  @Field({ complexity: 1 })
  @Length(1, 72)
    password!: string;
}
