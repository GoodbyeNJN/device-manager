import { NestFactory } from '@nestjs/core';
import { WakeModule } from './wake.module';

async function bootstrap() {
  const app = await NestFactory.create(WakeModule);
  await app.listen(3000);
}
bootstrap();
