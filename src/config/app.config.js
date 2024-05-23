'use strict'
import { env } from "@/utils/function";

const dev = {
    app: {
        port: env('DEV_APP_PORT', 5789),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
        secret_access: env('ACCESS_TOKEN_SECRET', 'secret_access'),
        secret_refresh: env('REFRESH_TOKEN_SECRET', 'secret_refresh'),
    },
    db: {
        port: env('PORT', 27017),
        host: env('HOST', 'localhost'),
        database: env('DB_NAME', 'test'),
    }

}
const pro = {
    app: {
        port: env('PRO_APP_PORT', 5789),
        prefix: env('PRO_ROUTER_PREFIX', '/api/v1'),
        secret_access: env('ACCESS_TOKEN_SECRET', 'secret_access'),
        secret_refresh: env('REFRESH_TOKEN_SECRET', 'secret_refresh'),
    },
    db: {
        port: env('PORT', 27017),
        host: env('HOST', 'localhost'),
        database: env('DB_NAME', 'test')
    }
}

const config = { dev, pro }
const node = env("NODE_ENV", "dev")
export default config[node];