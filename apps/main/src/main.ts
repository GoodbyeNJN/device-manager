import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@app/config';
import { AppModule } from './modules/app';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { host, port } = configService.mainConfig.listen;

  await app.listen(port, host);
  Logger.log(`[apps/main] Listening on ${await app.getUrl()}`);
};
bootstrap();
