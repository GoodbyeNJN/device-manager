export const MessagePatterns = {
  WakeUp: { cmd: 'wake_up' },
};

export namespace Payloads {
  export interface WakeUp {}
}

export namespace Results {
  export type WakeUp = string;
}
