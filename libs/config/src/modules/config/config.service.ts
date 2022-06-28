import { Injectable } from '@nestjs/common';
import { ConfigService as EnvConfigService } from '@nestjs/config';

import type { Config } from './config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly envConfigService: EnvConfigService<Config>) {}

  public get mainConfig() {
    return this.envConfigService.get('main', { infer: true });
  }

  public get wakeConfig() {
    return this.envConfigService.get('wake', { infer: true });
  }
}
