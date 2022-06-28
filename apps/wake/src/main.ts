import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@app/config';
import { WakeModule } from './modules/wake';

const bootstrap = async () => {
  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  const appContext = await NestFactory.createApplicationContext(ConfigModule);
  const configService = appContext.get(ConfigService);
  // TODO End

  const { host, port } = configService.wakeConfig.listen;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WakeModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );
  await app.listen();

  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  // Close the temporary app context since we no longer need it
  appContext.close();
  // TODO End
};
bootstrap();
