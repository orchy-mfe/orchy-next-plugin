import {MicroFrontendProperties} from '@orchy-mfe/models'
import OrchySpaAdapter from '@orchy-mfe/spa-adapter'

import {NextPluginProps} from './next-router-adapters'
export declare class OrchyNextPlugin extends OrchySpaAdapter<NextPluginProps> {
    private modifiedDomHandler?
    private checkNextBase
    private patchContent
    private manageTemplate
    mount(orchyProperties?: MicroFrontendProperties<NextPluginProps>): Promise<void>;
    unmount(): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'orchy-next-plugin': OrchyNextPlugin;
    }
    interface Window {
        next: any;
    }
}
