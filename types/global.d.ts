declare global {
    interface FormElement<T> extends HTMLFormElement {
        readonly elements: Record<T, HTMLInputElement> & HTMLFormControlsCollection;
    }
}

export {};
