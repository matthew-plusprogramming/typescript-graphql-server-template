import { ObjectId } from 'mongodb';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '@entity/User';
import { UnknownAuthError } from './errors';
import { isAuth } from './middleware/isAuth';
import { AuthContext } from '~types/AuthContext';

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User)
  async me(@Ctx() ctx: AuthContext): Promise<User> {
    if (!ctx.authContext.userToken) throw new UnknownAuthError();

    const user = await User.findOne({
      where: { _id: new ObjectId(ctx.authContext.userToken.sub) }
    });

    if (!user) throw new UnknownAuthError();
    return user;
  }
}
