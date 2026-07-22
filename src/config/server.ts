import http from 'http';

export interface StartHttpServerOptions {
  app: http.RequestListener;
  port: number | string;
  serviceName: string;
  timeoutMs?: number;
  onShutdown?: () => Promise<void> | void;
}

const KEEP_ALIVE_TIMEOUT_MS = 65_000;
const HEADERS_TIMEOUT_MS = 66_000;
const FORCE_EXIT_TIMEOUT_MS = 15_000;

export const startHttpServer = ({
  app,
  port,
  serviceName,
  timeoutMs = 30_000,
  onShutdown,
}: StartHttpServerOptions): http.Server => {
  const server = http.createServer(app);
  server.timeout = timeoutMs;
  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  server.headersTimeout = HEADERS_TIMEOUT_MS;

  server.listen(port, () => {
    const address = server.address();
    const boundPort = typeof address === 'object' && address ? address.port : port;
    console.log(`[${serviceName}] listening on port ${boundPort}`);
  });

  const shutdown = (signal: string) => {
    console.log(`[${serviceName}] ${signal} received, draining…`);
    server.close(async () => {
      try {
        await onShutdown?.();
        console.log(`[${serviceName}] shutdown complete`);
        process.exit(0);
      } catch (err) {
        console.error(`[${serviceName}] error during shutdown:`, err);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error(`[${serviceName}] shutdown timeout, forcing exit`);
      process.exit(1);
    }, FORCE_EXIT_TIMEOUT_MS).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
};
