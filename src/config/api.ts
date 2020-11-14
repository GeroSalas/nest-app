import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  port: Number(process.env.SERVER_PORT) || 5000,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_DURATION,
    },
  },
  dbUrl: process.env.DB_URL,
  redisUrl: process.env.REDIS_URL,
}));
