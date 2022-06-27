import { Injectable, Inject } from '@nestjs/common';
import { MessagePatterns } from '@app/define';
import { ClientProxy } from '@nestjs/microservices';
import { Clients } from './define';

import type { Payloads, Results } from '@app/define';

@Injectable()
export class AppService {
  constructor(@Inject(Clients.Wake) private readonly client: ClientProxy) {}

  public async wakeUpDevice() {
    return this.client.send<Results.WakeUp, Payloads.WakeUp>(
      MessagePatterns.WakeUp,
      {},
    );
  }
}
