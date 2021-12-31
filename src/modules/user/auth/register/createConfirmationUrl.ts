import { v4 } from 'uuid';
import { env } from 'config';
import { redis } from 'redis';

export const createConfirmationUrl =
async (userId: string): Promise<string> => {
  const id = v4();

  await redis.set(id, userId, 'ex', 60 * 60 * 24);
  const port = env.PORT;
  const fullServerIp =
    `${env.SERVER_IP}${(port !== '80' && port !== '443') ? `:${port}` : '' }`;

  return `${fullServerIp}/user/confirm/${id}`;
};
