export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  mongo: {
    host: process.env.MONGO_HOST || 'localhost',
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    user: process.env.MONGO_USER || 'henry_chou',
    password: process.env.MONGO_PASSWORD || 'admin1337tw',
    dbName: process.env.MONGO_DB_NAME || 'my-demo-db',
  },
});

export interface MongoConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};