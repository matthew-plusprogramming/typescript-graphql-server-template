import { JwtPayload, sign } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { User } from '@entity/User';
import { UserAuthTokens } from '@entity/UserAuthTokens';
import { env } from 'config';
import { jwtAccessTokenOptions, jwtRefreshTokenOptions } from './jwtOptions';

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}
export const generateAuthTokenPair =
async (user: User): Promise<AuthTokenPair> => {
  const authTokenPair = {
    accessToken: await generateAccessToken(user),
    refreshToken: await generateRefreshToken(user)
  };

  // We want to keep only one pair of auth tokens valid for any given user
  const existingUserAuthTokens = await UserAuthTokens.findOne({
    where: { userId: user._id }
  });
  if (existingUserAuthTokens) {
    await existingUserAuthTokens.remove();
  }

  await UserAuthTokens.update(
    { userId: user._id },
    {
      accessToken: authTokenPair.accessToken,
      refreshToken: authTokenPair.refreshToken
    }
  );
  return authTokenPair;
};

export const regenerateAuthTokenPair =
async (verifiedRefreshToken: string, verifiedRefreshTokenPayload: JwtPayload):
Promise<AuthTokenPair> => {
  // Any errors thrown will be treated as invalid login credentials
  const existingUserAuthTokens = await UserAuthTokens.findOne({
    where: { userId: new ObjectId(verifiedRefreshTokenPayload.sub as string) }
  });
  if (existingUserAuthTokens) {
    if (existingUserAuthTokens.refreshToken !== verifiedRefreshToken) {
      // Unauthorized reuse detected, invalidate all auth for this user
      await existingUserAuthTokens.remove();
      throw new Error();
    }
    const user = await User.findOne({
      where: { _id: existingUserAuthTokens.userId }
    });
    if (user) {
      const newTokens = await generateAuthTokenPair(user);

      await UserAuthTokens.update(
        { _id: existingUserAuthTokens._id },
        {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken
        }
      );

      return newTokens;
    }
    else throw new Error();
  }
  else throw new Error();
};

const generateAccessToken = async (user: User): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(
      { sub: user._id },
      env.JWT_SECRET_KEY as string,
      jwtAccessTokenOptions,
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};
const generateRefreshToken = async (user: User): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(
      { sub: user._id },
      env.JWT_SECRET_KEY as string,
      jwtRefreshTokenOptions,
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};
