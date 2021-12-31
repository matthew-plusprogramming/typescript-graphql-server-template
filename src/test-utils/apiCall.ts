import supertest, { Response } from 'supertest';
import { app } from 'server';

export enum RequestType {
  GET = 'GET',
  POST = 'POST'
}

export interface Options {
  endpoint: string;
  requestType: RequestType;
  headers?: Record<string, string>
}

export const apiCall =
async ({
  endpoint, requestType, headers
}: Options): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    const request = supertest(app);
    const baseTest = (() => {
      switch(requestType) {
      case RequestType.GET:
        return request.get(endpoint);
      case RequestType.POST:
        return request.post(endpoint);
      }
    })();

    baseTest
      .set({ ...headers })
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
  });
};
