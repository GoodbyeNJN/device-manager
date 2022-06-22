import { Controller, Get } from '@nestjs/common';
import { WakeService } from './wake.service';

@Controller()
export class WakeController {
  constructor(private readonly wakeService: WakeService) {}

  @Get()
  getHello(): string {
    return this.wakeService.getHello();
  }
}
