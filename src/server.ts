import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Server } from 'http';
import 'reflect-metadata';
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
      plugins: [ ApolloServerPluginLandingPageGraphQLPlayground ]
    });
    await apolloServer.start();
    app = express();
    app.use(cors());

    app.get('/', (_, res) => {
      res.status(200).send('OK');
    });
    apolloServer.applyMiddleware({ app });

    expressServer = app.listen(testMode ? env.TEST_PORT : env.PORT, () => {
      console.log(`App is listening on port ${env.PORT}`);
    });
  };

export const stopServer = async (): Promise<void> => {
  if (connection) await connection.close();
  if (expressServer) await expressServer.close();
  if (apolloServer) await apolloServer.stop();
};
