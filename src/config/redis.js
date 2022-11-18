import { createClient } from 'redis';

const client = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`,
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

export default client;
