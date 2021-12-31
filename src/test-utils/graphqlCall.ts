import { ExecutionResult } from 'graphql';
import supertest from 'supertest';
import { Maybe } from 'type-graphql';
import { app } from 'server';

export interface Options {
  source: string;
  variableValues?: Maybe<Record<string, unknown>>;
  headers?: Record<string, string>
}

export const graphqlCall =
async ({
  source, variableValues, headers
}: Options): Promise<ExecutionResult> => {
  return new Promise<ExecutionResult>((resolve, reject) => {
    const request = supertest(app);
    request
      .post('/graphql')
      .send({
        query: source,
        variables: variableValues
      })
      .set('Accept', 'application/json')
      .set({ ...headers })
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res.body);
      });
  });
};
