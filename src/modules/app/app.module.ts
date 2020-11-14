import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { RedisModule } from 'nestjs-redis';
import config from '../../config';
import AuthModule from '../auth/auth.module';
import UsersModule from '../users/users.module';
import AppService from './app.service';
import AppController from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    KnexModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const env = configService.get('NODE_ENV');
        const config = configService.get<any>(`db.${env}`);
        console.info(`Using "${env}" knex config...`);
        return { config };
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.get<any>('redis'),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
