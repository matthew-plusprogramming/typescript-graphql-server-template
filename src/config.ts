import { config } from 'dotenv';
config();

const {
  PORT,
  TEST_PORT,
  JWT_SECRET_KEY,
  NODE_ENV,
  SERVER_IP,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN
} = process.env as {
  [key: string]: string;
};

export const env = {
  PORT,
  TEST_PORT,
  JWT_SECRET_KEY,
  NODE_ENV,
  SERVER_IP,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN
};
