import { Module } from '@nestjs/common';
import { WakeController } from './wake.controller';
import { WakeService } from './wake.service';

@Module({
  imports: [],
  controllers: [WakeController],
  providers: [WakeService],
})
export class WakeModule {}
