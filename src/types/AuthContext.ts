import { AuthToken } from './authTypes';
import { BaseContext } from './BaseContext';

export interface AuthContext extends BaseContext {
  authContext: {
    userToken: AuthToken | null;
  };
}
