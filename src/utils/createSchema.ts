import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

export const createSchema =
async (): Promise<GraphQLSchema> => await buildSchema({
  resolvers: [
    `${__dirname}/../modules/**/*.resolver.ts`
  ]
});
