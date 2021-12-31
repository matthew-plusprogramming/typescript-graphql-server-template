import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { ObjectId } from 'mongodb';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Server } from 'http';
import 'reflect-metadata';
import { User } from '@entity/User';
import { redis, stopRedis } from 'redis';
import { env } from './config';
import { createSchema } from './utils/createSchema';
import ormconfig from '~escape-src/ormconfig.json';
import testOrmconfig from '~escape-src/test-ormconfig.json';

let connection: Connection;
let expressServer: Server;
let apolloServer: ApolloServer;
export let app: express.Express;

export const startServer =
  async (testMode = false, drop = false): Promise<void> => {
    let connectionOptions: ConnectionOptions = {
      'type': 'mongodb',
      'synchronize': drop,
      'dropSchema': drop,
      'entities': [
        `${__dirname}/entity/*.*`
      ]
    };

    connectionOptions = testMode ?
      { ...connectionOptions, ...testOrmconfig }
      : { ...connectionOptions, ...ormconfig };

    connection = await createConnection(connectionOptions);
    const schema = await createSchema();

    apolloServer = new ApolloServer({
      schema,
      introspection: env.NODE_ENV !== 'production',
      plugins: [ ApolloServerPluginLandingPageGraphQLPlayground ],
      context: ({ req }: {req: express.Request}) => ({ headers: req.headers })
    });
    await apolloServer.start();
    app = express();
    app.use(cors());

    app.get('/', (_, res) => {
      res.status(200).send('OK');
    });
    app.get('/user/confirm/:confirmId', async (req, res) => {
      const { confirmId } = req.params;
      const userId = await redis.get(confirmId);
      if (!userId) res.status(404).send('Invalid id');

      await redis.del(confirmId);
      await User.update({ _id: new ObjectId(userId) }, { confirmed: true });
      res.status(200).send('OK');
    });
    apolloServer.applyMiddleware({ app });

    const port = testMode ? env.TEST_PORT : env.PORT;
    expressServer = app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  };

export const stopServer = async (): Promise<void> => {
  if (connection) await connection.close();
  if (expressServer) await expressServer.close();
  if (apolloServer) await apolloServer.stop();
  if (redis) await stopRedis();
};
