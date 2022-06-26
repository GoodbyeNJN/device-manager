import { Module, Global } from '@nestjs/common';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { getDefaultConfig } from './default-config';

@Global()
@Module({
  imports: [
    EnvConfigModule.forRoot({
      load: [getDefaultConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
