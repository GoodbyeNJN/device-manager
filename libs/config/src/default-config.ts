import type { Config } from './config.interface';

export const defaultConfig: Config = {
  main: {
    listen: {
      host: process.env.MAIN_LISTEN_HOST || '0.0.0.0',
      port: parseInt(process.env.MAIN_LISTEN_PORT, 10) || 3000,
    },
  },

  wake: {
    listen: {
      host: process.env.WAKE_LISTEN_HOST || '0.0.0.0',
      port: parseInt(process.env.WAKE_LISTEN_PORT, 10) || 3001,
    },

    serial: {
      command: {
        test: Buffer.from([0x00]),
        connect: Buffer.from([0xa0, 0x01, 0x01, 0xa2]),
        disconnect: Buffer.from([0xa0, 0x01, 0x00, 0xa1]),
      },

      path: process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0',
      baudRate: 9600,
    },
  },
};

export const getDefaultConfig = () => defaultConfig;
