import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config';
import { WakeController } from './wake.controller';
import { WakeService } from './wake.service';

@Module({
  imports: [ConfigModule],
  controllers: [WakeController],
  providers: [WakeService],
})
export class WakeModule {}
