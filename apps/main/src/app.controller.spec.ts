import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@app/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Clients } from './define';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: Clients.Wake,
          useFactory: (configService: ConfigService) => {
            const { host, port } = configService.wakeConfig.listen;
            return ClientProxyFactory.create({
              transport: Transport.TCP,
              options: { host, port },
            });
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "ok"', () => {
      expect(appController.onWakeUp()).toBe('ok');
    });
  });
});
