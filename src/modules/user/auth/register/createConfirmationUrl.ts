import { v4 } from 'uuid';
import { env } from '~/config';
import { redis } from '~/redis';

export const createConfirmationUrl =
async (userID: string): Promise<string> => {
  const id = v4();

  await redis.set(id, userID, 'EX', 60 * 60 * 24);
  const port = env.PORT;
  const fullServerIP =
    `${env.SERVER_IP}${(port !== '80' && port !== '443') ? `:${port}` : '' }`;

  return `${fullServerIP}/user/confirm/${id}`;
};
