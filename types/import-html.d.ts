import {NextPluginProps} from './next-router-adapters'
export declare const patchElement: (htmlElement: HTMLElement | Document, orchyProperties: NextPluginProps) => void
export declare const importHtml: (orchyProperties?: NextPluginProps) => Promise<import('import-html-entry').IImportResult>
