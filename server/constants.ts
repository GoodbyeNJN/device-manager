export const CHECK_COMMAND = Buffer.from([0xa0, 0x01, 0x05, 0xa6]);

export const CONNECT_COMMAND = Buffer.from([0xa0, 0x01, 0x03, 0xa4]);
export const DISCONNECT_COMMAND = Buffer.from([0xa0, 0x01, 0x02, 0xa3]);

// export const CONNECT_COMMAND = Buffer.from([0xa0, 0x01, 0x01, 0xa2]);
// export const DISCONNECT_COMMAND = Buffer.from([0xa0, 0x01, 0x00, 0xa1]);

export const CONNECT_STATUS = Buffer.from([0xa0, 0x01, 0x01, 0xa2]);
export const DISCONNECT_STATUS = Buffer.from([0xa0, 0x01, 0x00, 0xa1]);
