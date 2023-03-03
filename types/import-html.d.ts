import {NextPluginProps} from './next-router-adapters'
export declare const patchElement: (htmlElement: HTMLElement | Document, orchyProperties: NextPluginProps) => void
export declare const importHtml: (orchyProperties?: NextPluginProps) => Promise<{
    documentElement: HTMLElement;
    execScripts: <T>(sandbox?: object | undefined, strictGlobal?: boolean | undefined, opts?: import('import-html-entry').ExecScriptOpts | undefined) => Promise<T>;
}>
