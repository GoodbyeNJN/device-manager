import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagePatterns } from '@app/define';
import { WakeService } from './wake.service';

import type { Results } from '@app/define';

@Controller()
export class WakeController {
  constructor(private readonly wakeService: WakeService) {}

  @MessagePattern(MessagePatterns.WakeUp)
  async onWakeUp(): Promise<Results.WakeUp> {
    return this.wakeService.wakeUpThroughSerialPort();
  }
}
