import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
