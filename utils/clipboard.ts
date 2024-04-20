export const readClipboard = async () => {
    const text = await navigator.clipboard.readText();
    return text;
};

export const writeClipboard = async (text: string) => {
    await window.navigator.clipboard.writeText(text);
};
