import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '@entity/User';
import { Success } from './Auth';
import { sendConfirmationEmail } from './email/sendConfirmationEmail';
import { SendConfirmationEmailInput } from './email/SendConfirmationEmailInput';
import { UnknownAuthError } from './errors';
import { createConfirmationUrl } from './register/createConfirmationUrl';

@Resolver()
export class Email {
  @Mutation(() => Success)
  async sendConfirmationEmail(
    @Arg('data') {
      email
    }: SendConfirmationEmailInput
  ): Promise<Success> {
    const user = await User.findOne({
      email
    });

    if (!user) throw new UnknownAuthError();

    await sendConfirmationEmail(
      email,
      await createConfirmationUrl(user._id.toString())
    );

    return new Success();
  }
}
