import { MicroFrontendProperties } from '@orchy-mfe/models';
export type NextPluginProps = MicroFrontendProperties & {
    nextBase: string;
};
export declare const beforePopStateAdapter: (window: Window, orchyProperties?: NextPluginProps) => ({ url, as, options }: any) => boolean;
export declare const popStateAdapter: (event: any) => void;
