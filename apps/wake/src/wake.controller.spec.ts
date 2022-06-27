import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@app/config';
import { WakeController } from './wake.controller';
import { WakeService } from './wake.service';

describe('WakeController', () => {
  let wakeController: WakeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [WakeController],
      providers: [WakeService],
    }).compile();

    wakeController = app.get<WakeController>(WakeController);
  });

  describe('root', () => {
    it('should return "ok"', () => {
      expect(wakeController.onWakeUp()).toBe('ok');
    });
  });
});
