import { hash } from 'bcryptjs';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '@entity/User';
import { UserAndAuth } from './Auth';
import { generateAuthTokenPair } from './jwtUtil';
import { RegisterInput } from './register/RegisterInput';

@Resolver()
export class RegisterResolver {
  @Mutation(() => UserAndAuth)
  async register(
    @Arg('data') {
      username,
      firstName,
      lastName,
      email,
      password
    }: RegisterInput
  ): Promise<UserAndAuth> {
    // Hash password and save to db
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();
    const newAuthTokens = await generateAuthTokenPair(user);
    return new UserAndAuth(newAuthTokens, user);
  }
}
