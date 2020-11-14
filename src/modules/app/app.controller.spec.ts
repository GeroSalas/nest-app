import { Test, TestingModule } from '@nestjs/testing';
import AppController from './app.controller';
import AppService from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "HELLO LUCKY APP!"', () => {
      expect(appController.sayHello()).toBe('HELLO LUCKY APP!');
    });

    it('should return "{ status: OK }"', () => {
      expect(appController.healthCheck().status).toBe('OK!');
    });
  });
});
