import {MicroFrontendProperties} from '@orchy-mfe/models'
export type NextPluginProps = {
    nextBase: string;
};
export declare const beforePopStateAdapter: (window: Window, orchyProperties?: MicroFrontendProperties<NextPluginProps>) => ({url, as, options}: any) => boolean
export declare const popStateAdapter: (event: any) => void
