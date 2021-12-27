import { config } from 'dotenv';
config();

const { PORT, TEST_PORT, JWT_SECRET_KEY, NODE_ENV } = process.env as {
  [key: string]: string;
};

export const env = { PORT, TEST_PORT, JWT_SECRET_KEY, NODE_ENV };

