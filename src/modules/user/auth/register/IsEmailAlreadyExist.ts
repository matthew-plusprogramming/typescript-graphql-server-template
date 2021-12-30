import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { User } from '@entity/User';
import { RegisterInput } from './RegisterInput';

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
implements ValidatorConstraintInterface {
  validate(email: string): Promise<boolean> {
    return User.findOne({ where: { email } }).then(user => {
      if (user) return false;
      return true;
    });
  }
}

export const IsEmailAlreadyExist = (validationOptions?: ValidationOptions) => {
  return (object: RegisterInput, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint
    });
  };
};
