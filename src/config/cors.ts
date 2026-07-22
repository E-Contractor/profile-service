const DEVTUNNELS = /https:\/\/.*\.devtunnels\.ms\/?$/;

export const buildCorsOptions = () => {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const gateway =
    process.env.API_GATEWAY_URL || process.env.GATEWAY_URL || 'http://localhost:3000';

  const origin: (string | RegExp)[] = [
    frontend,
    gateway,
    DEVTUNNELS,
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  return { origin, credentials: true };
};
