import { Field, ObjectType } from 'type-graphql';
import { User } from '@entity/User';

@ObjectType()
export class Auth {
  @Field({ complexity: 1 })
    accessToken!: string;

  @Field({ complexity: 1 })
    refreshToken!: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

@ObjectType()
export class UserAndAuth {
  @Field({ complexity: 1 })
    auth!: Auth;

  @Field({ complexity: 1 })
    user!: User;

  constructor(auth: Auth, user: User) {
    this.auth = auth;
    this.user = user;
  }
}

@ObjectType()
export class Success {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Field({ complexity: 1 })
    message: string = 'Success';
}
