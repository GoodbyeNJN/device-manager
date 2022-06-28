import morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@app/config';
import { AppModule } from './modules/app';
import { TransformInterceptor } from './interceptors/transform';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('tiny'));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const { host, port } = configService.mainConfig.listen;
  await app.listen(port, host);
};
bootstrap();
