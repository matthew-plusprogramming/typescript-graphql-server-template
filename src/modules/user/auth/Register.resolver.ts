import { hash } from 'bcryptjs';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '@entity/User';
import { Email } from './Email.resolver';
import { RegisterInput } from './register/RegisterInput';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg('data') {
      username,
      firstName,
      lastName,
      email,
      password
    }: RegisterInput
  ): Promise<User> {
    // Hash password and save to db
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    await new Email().sendConfirmationEmail({ email: user.email });
    return user;
  }
}
