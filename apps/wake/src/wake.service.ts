import { Injectable } from '@nestjs/common';

@Injectable()
export class WakeService {
  getHello(): string {
    return 'Hello World!';
  }
}
