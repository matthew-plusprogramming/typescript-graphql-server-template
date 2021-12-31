import { Field, ObjectType } from 'type-graphql';
import { User } from '@entity/User';

@ObjectType()
export class Auth {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

@ObjectType()
export class UserAndAuth {
  @Field()
  auth!: Auth;

  @Field()
  user!: User;

  constructor(auth: Auth, user: User) {
    this.auth = auth;
    this.user = user;
  }
}

@ObjectType()
export class Success {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Field()
  message: string = 'Success';
}
