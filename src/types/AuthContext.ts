import { AuthToken } from './authTypes';

export interface AuthContext {
  headers: {
    authorization: string;
  };
  rippleAuthContext: {
    userToken: AuthToken | null;
  };
}
