import faker from 'faker';
import { User }from '@entity/User';
import { UserAuthTokens } from '@entity/UserAuthTokens';
import { LoginErrorMessages } from '@modules/user/auth/login/errors';
import { generateMutation } from '@test-utils/generateMutation';
import { graphqlCall } from '@test-utils/graphqlCall';
import { startServer, stopServer } from 'server';
import { RegisterErrorMessages } from './register/errors';

beforeAll(async () => {
  await startServer(true, false);
});
afterAll(async () => {
  await stopServer();
});

const registerMutation = generateMutation(
  'Register',
  'RegisterInput',
  `
  user {
    email,
    firstName,
    lastName,
    username
  }
  `
);
const loginMutation = generateMutation(
  'Login',
  'LoginInput',
  `
  user {
    email,
    firstName,
    lastName,
    username
  },
  auth {
    accessToken,
    refreshToken
  }
  `
);

describe('Auth', () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName()
  };
  const auth = {
    accessToken: '',
    refreshToken: ''
  };

  it('register and create user', async () => {
    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    expect(response).toMatchObject({
      data: {
        register: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
          }
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(user.email);
    expect(dbUser?.firstName).toBe(user.firstName);
    expect(dbUser?.lastName).toBe(user.lastName);
    expect(dbUser?.username).toBe(user.username);
  });
  it('fail register on duplicate email', async () => {
    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const responseErrors = response.errors;
    expect(responseErrors).toBeTruthy();
    const errorMessageGeneral = responseErrors![ 0 ].message;
    expect(errorMessageGeneral).toBe('Argument Validation Error');
    const errorMessageSpecific =
      responseErrors![ 0 ].extensions.exception
        .validationErrors[ 0 ].constraints.IsEmailAlreadyExistConstraint;
    expect(errorMessageSpecific)
      .toBe(RegisterErrorMessages.EMAIL_ALREADY_IN_USE);

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(user.email);
    expect(dbUser?.firstName).toBe(user.firstName);
    expect(dbUser?.lastName).toBe(user.lastName);
    expect(dbUser?.username).toBe(user.username);
  });

  it('login user with email and password', async () => {
    const response = await graphqlCall({
      source: loginMutation,
      variableValues: {
        data: { email: user.email, password: user.password }
      }
    });

    const responseDataAuth = response.data?.login?.auth;
    expect(responseDataAuth).toBeDefined();
    auth.accessToken = responseDataAuth?.accessToken;
    auth.refreshToken = responseDataAuth?.refreshToken;
    expect(auth.accessToken).toBeTruthy();
    expect(auth.refreshToken).toBeTruthy();

    expect(response).toMatchObject({
      data: {
        login: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
          },
          auth: {
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken
          }
        }
      }
    });
  });
  it('login user with refresh token', async () => {
    const response = await graphqlCall({
      source: loginMutation,
      variableValues: {
        data: { refreshToken: auth.refreshToken }
      }
    });

    const responseDataAuth = response.data?.login?.auth;
    expect(responseDataAuth).toBeDefined();
    // ! This line was removed purposefully for the next test
    // auth.refreshToken = responseDataAuth?.refreshToken;
    expect(auth.accessToken).toBeTruthy();
    expect(auth.refreshToken).toBeTruthy();

    expect(response).toMatchObject({
      data: {
        login: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
          },
          auth: {
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken
          }
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    const dbUserAuthTokens =
      await UserAuthTokens.findOne({ where: { userId: dbUser?._id } });
    expect(dbUserAuthTokens).toBeTruthy();
  });
  it('fail login on reuse of refresh token', async () => {
    const response = await graphqlCall({
      source: loginMutation,
      variableValues: {
        data: { refreshToken: auth.refreshToken }
      }
    });

    const responseDataAuth = response.data?.login?.auth;
    expect(responseDataAuth).toBeUndefined();
    expect(response).toMatchObject({
      errors: [
        { message: LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS }
      ]
    });
  });
  it('fail login on invalid refresh token', async () => {
    const response = await graphqlCall({
      source: loginMutation,
      variableValues: {
        data: { refreshToken: 'thisisnotcorrect' }
      }
    });

    const responseDataAuth = response.data?.login?.auth;
    expect(responseDataAuth).toBeUndefined();
    expect(response).toMatchObject({
      errors: [
        { message: LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS }
      ]
    });
  });
  it('fail login on invalid password', async () => {
    const response = await graphqlCall({
      source: loginMutation,
      variableValues: {
        data: { email: user.email, password: 'thisisnotcorrect' }
      }
    });

    const responseDataAuth = response.data?.login?.auth;
    expect(responseDataAuth).toBeUndefined();

    expect(response).toMatchObject({
      errors: [
        { message: LoginErrorMessages.INCORRECT_LOGIN_CREDENTIALS }
      ]
    });
  });
});
