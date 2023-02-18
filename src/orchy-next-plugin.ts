import {MicroFrontendProperties} from '@orchy-mfe/models'
import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
import {customElement} from 'lit/decorators.js'

import {importHtml} from './import-html'
import {beforePopStateAdapter, NextPluginProps, popStateAdapter} from './next-router-adapters'
import {createProxy, PROXIFIED_GLOBALS} from './proxy'

const RELATIVE_SRC_SELECTOR = '[src^="/"]'

@customElement('orchy-next-plugin')
export class OrchyNextPlugin extends OrchySpaAdapter<NextPluginProps> {
  private modifiedDomHandler?: () => number

  private checkNextBase(orchyProperties?: MicroFrontendProperties<NextPluginProps>) {
    if (!orchyProperties?.nextBase) {
      throw new Error('nextBase has not been defined')
    }
  }

  private patchContent(orchyProperties?: MicroFrontendProperties<NextPluginProps>) {
    const container = this.getContainer()
    container
      .querySelectorAll(RELATIVE_SRC_SELECTOR)
      .forEach(element => element.setAttribute('src', orchyProperties!.nextBase! + element.getAttribute('src')!))
  }

  private async manageTemplate(orchyProperties?: MicroFrontendProperties<NextPluginProps>): Promise<void> {
    const importResult = await importHtml(orchyProperties)

    const importedTemplate = new DOMParser().parseFromString(importResult.template, 'text/html')

    const container = this.getContainer()
    container.replaceChildren(importedTemplate.documentElement)

    const proxy = createProxy(container)
    await importResult.execScripts(proxy, true, {scopedGlobalVariables: PROXIFIED_GLOBALS})
    setTimeout(() => proxy.window.next.router.beforePopState(beforePopStateAdapter(proxy.window, orchyProperties)), 0)
  }

  async mount(orchyProperties?: MicroFrontendProperties<NextPluginProps>): Promise<void> {
    this.checkNextBase(orchyProperties)
    this.modifiedDomHandler = () => setTimeout(() => this.patchContent(orchyProperties), 0)

    await this.manageTemplate(orchyProperties)

    this.getContainer().addEventListener('DOMSubtreeModified', this.modifiedDomHandler)
    window.addEventListener('popstate', popStateAdapter)
  }

  async unmount(): Promise<void> {
    const container = this.getContainer()
    container.removeEventListener('DOMSubtreeModified', this.modifiedDomHandler as () => void)
    window.removeEventListener('popstate', popStateAdapter)
    container.innerHTML = ''
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-next-plugin': OrchyNextPlugin
  }

  interface Window {
    next: any;
  }
}
