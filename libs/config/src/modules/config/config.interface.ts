export interface Listen {
  host: string;
  port: number;
}

export interface MainConfig {
  listen: Listen;
}

export interface SerialCommand {
  test: Buffer;
  connect: Buffer;
  disconnect: Buffer;
}

export interface WakeConfig {
  listen: Listen;

  serial: {
    command: SerialCommand;
    path: string;
    baudRate: number;
  };
}

export interface Config {
  main: MainConfig;
  wake: WakeConfig;
}

export interface Env {
  MAIN_LISTEN_HOST: string;
  MAIN_LISTEN_PORT: string;

  WAKE_LISTEN_HOST: string;
  WAKE_LISTEN_PORT: string;

  SERIAL_PORT_PATH: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
