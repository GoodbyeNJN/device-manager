import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@app/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Clients } from './define';

@Module({
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
})
export class AppModule {}
