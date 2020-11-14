import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import AppService from './app.service';

@ApiTags('Root')
@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: '200 OK! Returns you HELLO LUCKY APP!' })
  @Get()
  sayHello(): string {
    return this.appService.getHello();
  }

  @ApiOkResponse({ description: '200 OK! Returns healthy status' })
  @Get('health_check')
  healthCheck(): any {
    return this.appService.getStatus();
  }
}
