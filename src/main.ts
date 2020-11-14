import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { requestInfoLogger } from 'src/middlewares/logger.middleware';
import ValidationPipe from 'src/pipes/validationPipe';
import AppModule from 'src/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add some additional stuff
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(requestInfoLogger);
  app.useGlobalPipes(new ValidationPipe());

  // Setup API swagger docs
  const options = new DocumentBuilder()
    .setTitle('Testing Lucky Api')
    .setDescription('Coding assessment for Lucky App')
    .setVersion('0.0.1')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Start server on specified port
  const config = app.get(ConfigService);
  const serverPort = config.get('api.port');
  await app.listen(serverPort);
  console.log(`Server Application is running on: ${await app.getUrl()}`);
}

bootstrap();
