import { JwtPayload, sign } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { createHmac } from 'crypto';
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

  const userAuthTokensCreateParams = {
    userId: user._id,
    accessToken: authTokenPair.accessToken,
    refreshToken: authTokenPair.refreshToken
  };
  await UserAuthTokens.create(userAuthTokensCreateParams).save();
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
      await existingUserAuthTokens.remove();
      return await generateAuthTokenPair(user);
    }
    else throw new Error();
  }
  else throw new Error();
};

const generateJWTKey = (user: User): string => {
  const keyRaw = user._id + user.password;
  return createHmac('sha256', env.JWT_SECRET_KEY)
    .update(keyRaw)
    .digest('hex');
};

const generateAccessToken = async (user: User): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(
      { sub: user._id, key: generateJWTKey(user) },
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
      { sub: user._id, key: generateJWTKey(user) },
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
