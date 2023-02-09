import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
export declare class OrchyStoragePlugin extends OrchySpaAdapter {
    private modifiedDomHandler?
    private checkNextBase
    private patchContent
    private manageTemplate
    mount(orchyProperties?: any): Promise<void>;
    unmount(): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'orchy-next-plugin': OrchyStoragePlugin;
    }
    interface Window {
        next: any;
    }
}
