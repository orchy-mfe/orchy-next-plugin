export declare const PROXIFIED_GLOBALS: string[]
type NextProxy = {
    [k in typeof PROXIFIED_GLOBALS[number]]: any;
};
export declare const createProxy: (container: HTMLElement) => NextProxy
export {}
