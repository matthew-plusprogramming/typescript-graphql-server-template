export interface AuthToken {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
