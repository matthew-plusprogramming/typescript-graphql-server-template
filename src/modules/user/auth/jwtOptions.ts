import jwt from 'jsonwebtoken';

export const jwtAccessTokenOptions: jwt.SignOptions = {
  issuer: 'testissuer',
  audience: 'testissueraudience',
  algorithm: 'HS256',
  expiresIn: '5m'
};
export const jwtRefreshTokenOptions: jwt.SignOptions = {
  issuer: 'testissuer',
  audience: 'testissueraudience',
  algorithm: 'HS256',
  expiresIn: '60d'
};
