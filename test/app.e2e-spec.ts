import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import AppModule from '../src/modules/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('This framework is amazing!');
  });

  it('/health_check (GET)', () => {
    return request(app.getHttpServer()).get('/health_check').expect(200).expect({ status: 'OK!' });
  });

  afterAll(async () => {
    await app.close();
  });
});
