import { registerAs } from '@nestjs/config';
import { Redis } from 'ioredis';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  onClientReady: async (client: Redis): Promise<void> => {
    client.on('error', console.error);
    client.on('ready', () => {
      console.log('REDIS server is running on port 6379');
    });
    client.on('restart', () => {
      console.log('attempt to restart the REDIS server');
    });
  },
  reconnectOnError: (): boolean => true,
}));
