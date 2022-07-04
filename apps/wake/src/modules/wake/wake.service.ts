import { SerialPort } from 'serialport';
import { setTimeout } from 'timers/promises';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@app/config';

@Injectable()
export class WakeService {
  private serialPort: SerialPort;

  constructor(private readonly configService: ConfigService) {}

  private writeToSerialPort(data: Buffer) {
    return new Promise<void>((resolve, reject) => {
      this.serialPort.write(data, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }

  public async wakeUpThroughSerialPort() {
    const { command, path, baudRate } = this.configService.wakeConfig.serial;

    try {
      this.serialPort = new SerialPort({ path, baudRate });
      this.serialPort.on('error', (error) => {
        Logger.error(error);
      });
    } catch (error) {
      throw new InternalServerErrorException('open serial port error');
    }

    try {
      // await this.writeToSerialPort(command.test);
      // await setTimeout(500);
      await this.writeToSerialPort(command.connect);
      await setTimeout(300);
      await this.writeToSerialPort(command.disconnect);
      Logger.log('write to serial port success');
    } catch (error) {
      throw new InternalServerErrorException('write to serial port error');
    } finally {
      this.serialPort.close();
      Logger.log('serial port closed');
    }

    return 'ok';
  }
}
