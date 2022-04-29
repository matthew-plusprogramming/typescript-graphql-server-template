import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Server } from 'http';
import { User } from '@entity/User';
import { redis, stopRedis } from '~/redis';
import ormconfig from '~escape-src/ormconfig.json';
import testOrmconfig from '~escape-src/test-ormconfig.json';
import { env } from './config';
import { RateLimitPlugin } from './rateLimitPlugin';
import { createSchema } from './utils/createSchema';

let connection: DataSource;
let expressServer: Server;
let apolloServer: ApolloServer;
export let app: express.Express;

export const startServer =
  async (testMode = false, drop = false): Promise<void> => {
    // Construct typeorm connection options
    let connectionOptions: DataSourceOptions = {
      'type': 'mongodb',
      'synchronize': drop,
      'dropSchema': drop,
      'entities': [
        `${__dirname}/entity/*.*`,
        `${__dirname}/entity/**/*.*`
      ],
      'password': env.DB_PASSWORD
    };

    connectionOptions = testMode ?
      { ...connectionOptions, ...testOrmconfig }
      : { ...connectionOptions, ...ormconfig };

    connection = new DataSource(connectionOptions);
    await connection.initialize();
    const schema = await createSchema();

    apolloServer = new ApolloServer({
      schema,
      introspection: env.NODE_ENV !== 'production',
      validationRules: [ depthLimit(parseInt(env.QUERY_DEPTH_LIMIT)) ],
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground,
        RateLimitPlugin
      ],
      context: ({ req: { headers, ip } }: {req: express.Request}) => ({ headers, ip })
    });
    await apolloServer.start();
    app = express();
    app.use(cors());

    // TODO: Refactor these into separate file
    app.get('/', (_, res) => {
      res.status(200).send('OK');
    });
    app.get('/user/confirm/:confirmId', async (req, res) => {
      const { confirmId } = req.params;
      const userId = await redis.get(confirmId);
      if (!userId) {
        res.status(404).send('Invalid id');
        return;
      }

      await redis.del(confirmId);
      await User.update(userId, { confirmed: true });
      res.status(200).send('OK');
    });
    apolloServer.applyMiddleware({ app });

    const port = testMode ? env.TEST_PORT : env.PORT;
    expressServer = app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  };

export const stopServer = async (): Promise<void> => {
  if (connection) await connection.destroy();
  if (expressServer) await expressServer.close();
  if (apolloServer) await apolloServer.stop();
  if (redis) await stopRedis();
};
