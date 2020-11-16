import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { RedisModule } from 'nestjs-redis';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import config from '../src/config';
import AppModule from '../src/modules/app/app.module';
import AppService from '../src/modules/app/app.service';
import AppController from '../src/modules/app/app.controller';
import AuthModule from '../src/modules/auth/auth.module';
import UsersModule from '../src/modules/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          load: config,
        }),
        KnexModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            return { config: configService.get<any>(`db.test`)};
          },
          inject: [ConfigService],
        }),
        /* TODO: mock module
        RedisModule.forRootAsync({
          useFactory: async (configService: ConfigService) => configService.get<any>('redis'),
          inject: [ConfigService],
        }),
        */
        //AuthModule,
        //UsersModule, // repository @InjectKnex() throwing errors :7
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();
  });

  it('should verify NODE_ENV="test"', () => {
    const nodeEnv = process.env.NODE_ENV;
    expect(nodeEnv).toBe('test');
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('HELLO LUCKY APP!');
  });

  it('/health_check (GET)', () => {
    return request(app.getHttpServer()).get('/health_check').expect(200).expect({ status: 'OK!' });
  });

  afterAll(async () => {
    await app.close();
  });
});
