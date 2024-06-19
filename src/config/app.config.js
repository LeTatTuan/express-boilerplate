'use strict';
import { env } from '@/utils/function';

const dev = {
  app: {
    port: env('DEV_APP_PORT', 5789),
    prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
  },
  jwt: {
    secret: env('JWT_SECRET', 'lutech-ltd'),
    accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
    refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
  },
  db: {
    port: env('PORT', 27017),
    host: env('HOST', 'localhost'),
    database: env('DB_NAME', 'test'),
  },
};
const pro = {
  app: {
    port: env('PRO_APP_PORT', 5789),
    prefix: env('PRO_ROUTER_PREFIX', '/api/v1'),
  },
  jwt: {
    secret: env('JWT_SECRET', 'lutech-ltd'),
    accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
    refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
  },
  db: {
    port: env('PORT', 27017),
    host: env('HOST', 'localhost'),
    database: env('DB_NAME', 'test'),
  },
};

const config = { dev, pro };
const node = env('NODE_ENV', 'dev');
export default config[node];
