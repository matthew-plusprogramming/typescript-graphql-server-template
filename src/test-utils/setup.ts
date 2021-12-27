import { startServer, stopServer } from 'server';

(async () => {
  await startServer(true, true);
  await stopServer();
})();
