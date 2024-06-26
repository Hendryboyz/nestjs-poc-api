export default () => ({
  env: process.env.NODE_ENV || 'local',
  port: parseInt(process.env.PORT, 10) || 4000,
  mongo: {
    host: process.env.MONGO_HOST || 'localhost',
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    user: process.env.MONGO_USER || 'henry_chou',
    password: process.env.MONGO_PASSWORD || 'admin1337tw',
    dbName: process.env.MONGO_DB_NAME || 'my-demo-db',
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER || 'henry_chou',
    password: process.env.POSTGRES_PASSWORD || 'admin1337tw',
    dbName: process.env.POSTGRES_DB_NAME || 'my-demo-db',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'do-not-use-raw-text-here',
    expiresInSecs: parseInt(process.env.AUTH_TTL_SECS) || 86400,
  },
});

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};