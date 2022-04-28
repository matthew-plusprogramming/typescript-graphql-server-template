import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field({ complexity: 1, nullable: true })
    email?: string;

  @Field({ complexity: 1, nullable: true })
    password?: string;

  @Field({ complexity: 1, nullable: true })
    refreshToken?: string;
}
