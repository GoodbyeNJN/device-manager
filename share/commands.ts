export const relayCommand = {
    check: Buffer.from([0xa0, 0x01, 0x05, 0xa6]),
    connect: Buffer.from([0xa0, 0x01, 0x03, 0xa4]),
    disconnect: Buffer.from([0xa0, 0x01, 0x02, 0xa3]),
    // connect: Buffer.from([0xa0, 0x01, 0x01, 0xa2]),
    // disconnect: Buffer.from([0xa0, 0x01, 0x00, 0xa1]),
};
