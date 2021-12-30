import { compare } from 'bcryptjs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '@entity/User';
import { UserAuthTokens } from '@entity/UserAuthTokens';
import { env } from 'config';
import { UserAndAuth } from './Auth';
import { generateAuthTokenPair, regenerateAuthTokenPair } from './jwtUtil';
import {
  EmailNotConfirmedError,
  IncorrectLoginCredentialsError
} from './login/errors';
import { LoginInput } from './login/LoginInput';

@Resolver()
export class LoginResolver {
  @Mutation(() => UserAndAuth)
  async login(
    @Arg('data') {
      email,
      password,
      refreshToken
    }: LoginInput
  ): Promise<UserAndAuth> {
    if (refreshToken) {
      // Refresh token based login
      try {
        // Throws if token is invalid
        const payload =
          await verify(refreshToken, env.JWT_SECRET_KEY as string);
        // Rotate refresh token
        const newAuthTokens =
          await regenerateAuthTokenPair(refreshToken, payload as JwtPayload);
        const userAuthTokens = await UserAuthTokens.findOne({
          where: { refreshToken: newAuthTokens.refreshToken }
        });
        if (userAuthTokens) {
          const user = await User.findOne({
            where: { _id: userAuthTokens.userId }
          });
          if (user) {
            if (!user.confirmed) throw new EmailNotConfirmedError();
            return new UserAndAuth(newAuthTokens, user);
          }
        }
      }
      catch (err) {
        throw new IncorrectLoginCredentialsError();
      }
    }
    else if (typeof email !== 'undefined' && typeof password !== 'undefined') {
      // Email & password based login
      const user = await User.findOne({ where: { email } });
      if (!user) throw new IncorrectLoginCredentialsError();

      const validPassword = await compare(password, user.password);
      if (!validPassword) throw new IncorrectLoginCredentialsError();

      if (!user.confirmed) throw new EmailNotConfirmedError();

      const newAuthTokens = await generateAuthTokenPair(user);
      return new UserAndAuth(newAuthTokens, user);
    }

    throw new IncorrectLoginCredentialsError();
  }
}
