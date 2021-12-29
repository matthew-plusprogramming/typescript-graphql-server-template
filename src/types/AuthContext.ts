import { AuthToken } from './authTypes';

export interface AuthContext {
  headers: {
    authorization: string;
  };
  authContext: {
    userToken: AuthToken | null;
  };
}
