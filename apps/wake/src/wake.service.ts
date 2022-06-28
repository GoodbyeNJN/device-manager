import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { setTimeout } from 'timers/promises';
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
    } catch (error) {
      throw new InternalServerErrorException('open serial port error');
    }

    try {
      await this.writeToSerialPort(command.test);
      await setTimeout(500);
    } catch (error) {
      throw new InternalServerErrorException('write to serial port error');
    }

    await this.writeToSerialPort(command.connect);
    await setTimeout(200);
    await this.writeToSerialPort(command.disconnect);

    this.serialPort.close();

    return 'ok';
  }
}
