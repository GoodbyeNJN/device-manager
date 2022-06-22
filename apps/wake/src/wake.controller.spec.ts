import { Test, TestingModule } from '@nestjs/testing';
import { WakeController } from './wake.controller';
import { WakeService } from './wake.service';

describe('WakeController', () => {
  let wakeController: WakeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WakeController],
      providers: [WakeService],
    }).compile();

    wakeController = app.get<WakeController>(WakeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(wakeController.getHello()).toBe('Hello World!');
    });
  });
});
