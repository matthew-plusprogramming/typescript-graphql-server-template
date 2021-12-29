import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { env } from 'config';
import { UnauthorizedError } from '../errors';
import { AuthContext } from '~types/AuthContext';
import { AuthToken } from '~types/authTypes';

export const isAuth: MiddlewareFn<AuthContext> = async ({ context }, next) => {
  // Verify auth format
  const authArgs = context?.headers?.authorization?.split(' ');
  if (authArgs?.length !== 2 || authArgs[ 0 ].toLowerCase() !== 'bearer') {
    throw new UnauthorizedError();
  }

  // Verify user jwt
  const tokenString = authArgs[ 1 ];
  try {
    const tokenVerified = verify(
      tokenString,
      env.JWT_SECRET_KEY
    );

    // Set context and move to next middleware
    context.authContext = { userToken: tokenVerified as AuthToken };
    return next();
  }
  catch (err) {
    throw new UnauthorizedError();
  }
};
