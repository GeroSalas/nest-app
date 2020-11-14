import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  getHello(): string {
    return 'HELLO LUCKY APP!';
  }

  getStatus(): any {
    return { status: 'OK!' };
  }
}
