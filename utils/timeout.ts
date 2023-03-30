export const setTimeout = (delay?: number) =>
    new Promise<void>(resolve => {
        globalThis.setTimeout(() => resolve(), delay);
    });
