# Typescript Graphql Server Template :building_construction:

My complete GraphQL backend server template project.

Built with:
- TypeScript
- TypeGraphQL
- TypeORM
- Apollo Server
- Express
- MongoDB
- Redis

Features:
- Support for wallaby.js
- ESLint configuration
- Testing framework setup
  - Jest
  - Supertest
- Generic auth module
  - JWT authentication & additional security measures
    - Rotating refresh tokens
    - Authmatic refresh token reuse detection
  - Confirmation emails sent through nodemailer using the Gmail API

Planned Features:
- Auth module
  - Logout functionality
  - Forgot password functionality
- File uploads
- General security
  - Query complexity checks
  - Query depth limits
  - Paginated results
  - API timeouts
  - Rate limiting

## .Env Setup

Create a .env file in the root of the project and populate the following variables:
```env
PORT=3000 # You can set this to anything
TEST_PORT=0 # You can set this to anything, 0 makes it a random port
JWT_SECRET_KEY=XYZ # Put a JWT secret key here (I normally use a randomly generated HS256 key)
NODE_ENV=development # Set this to production when running production mode
SERVER_IP=123.45.6.78 # Set this to your server's IP address (can be https://...)

# Gmail client configuration
GMAIL_CLIENT_ID=XYZ
GMAIL_CLIENT_SECRET=XYZ
GMAIL_REFRESH_TOKEN=XYZ
```

For the Gmail client confiuration, I'm using the Gmail API to send confirmation emails, you can edit `src/modules/user/auth/register/sendConfirmationEmail.ts` to change the method for sending emails.

## TypeORM Configuration

TypeORM is configured in three places on this template. Feel free to change any you want.

ormconfig.json:
```json
{
  "name": "default",
  "host": "localhost", // Change this with your db host address if needed
  "port": 27017, // Change this with your db port if needed
  "database": "test-db", // Change this with your db name
  "logging": true,
  "useUnifiedTopology": true,
  "useNewUrlParser": true
}
```

test-ormconfig.json:
```json
{
  "name": "default",
  "host": "localhost",
  "port": 27017,
  "database": "test-db-test", // Change this with your test db name
  "useUnifiedTopology": true,
  "useNewUrlParser": true
}
```

src/server.ts (line 20):
```ts
let connectionOptions: ConnectionOptions = {
  'type': 'mongodb', // Change this to the type of db you're using
  'synchronize': drop,
  'dropSchema': drop,
  'entities': [
    `${__dirname}/entity/*.*`
  ]
};
```

## Misc Configuration

Update the `package.json` file changing the name, version, etc as needed.

## Server Installation:

Clone the repository, then create and [setup your .env file](#env-setup).

Then, [setup the typeorm config files as needed](#typeorm-configuration).

Finally, run the following commands in the root directory to get started:
```bash
# If using npm
$ npm install
# If using yarn
$ yarn
```

*If using npm just replace `yarn` with `npm run`*
```bash
# To start the server in development mode
$ yarn start
# To start the server in production mode
$ yarn start-production
# To run the jest tests manually
$ yarn test
```
