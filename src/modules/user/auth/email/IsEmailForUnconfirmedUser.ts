import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { User } from '@entity/User';
import { SendConfirmationEmailInput } from './SendConfirmationEmailInput';

@ValidatorConstraint({ async: true })
export class IsEmailForUnconfirmedUserConstraint
implements ValidatorConstraintInterface {
  validate(email: string): Promise<boolean> {
    return User.findOne({ where: { email } }).then(user => {
      if (user && !user.confirmed) return true;
      return false;
    });
  }
}

export const IsEmailForUnconfirmedUser =
(validationOptions?: ValidationOptions) => {
  return (object: SendConfirmationEmailInput, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailForUnconfirmedUserConstraint
    });
  };
};
