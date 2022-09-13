import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { getDefaultConfig } from './configuration';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
      imports: [
        EnvConfigModule.forRoot({
          load: [getDefaultConfig],
        }),
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have `mainConfig` property with values', () => {
    expect(service.mainConfig).toBeObject().toContainAllKeys(['listen']);

    expect(service.mainConfig.listen)
      .toBeObject()
      .toContainAllKeys(['host', 'port']);

    const { host, port } = service.mainConfig.listen;
    expect(host).toBeString().not.toBeEmpty();
    expect(port).toBeNumber().not.toBe(0);
  });

  it('should have `wakeConfig` property with values', () => {
    expect(service.wakeConfig)
      .toBeObject()
      .toContainAllKeys(['listen', 'serial']);

    expect(service.wakeConfig.listen)
      .toBeObject()
      .toContainAllKeys(['host', 'port']);

    const { host, port } = service.wakeConfig.listen;
    expect(host).toBeString().not.toBeEmpty();
    expect(port).toBeNumber().not.toBe(0);

    expect(service.wakeConfig.serial)
      .toBeObject()
      .toContainAllKeys(['command', 'path', 'baudRate']);

    const { command, path, baudRate } = service.wakeConfig.serial;
    expect(command)
      .toBeObject()
      .toContainAllKeys(['test', 'connect', 'disconnect']);

    const { test, connect, disconnect } = command;
    expect(test).toBeInstanceOf(Buffer);
    expect(connect).toBeInstanceOf(Buffer);
    expect(disconnect).toBeInstanceOf(Buffer);

    expect(path).toBeString().not.toBeEmpty();
    expect(baudRate).toBeNumber().not.toBe(0);
  });
});
