import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
import {customElement} from 'lit/decorators.js'

import {importHtml} from './import-html'
import {popStateAdapter} from './next-router-adapters'
import {createProxy, PROXIFIED_GLOBALS} from './proxy'

const RELATIVE_SRC_SELECTOR = '[src^="/"]'

@customElement('orchy-next-plugin')
export class OrchyStoragePlugin extends OrchySpaAdapter {
  private modifiedDomHandler?: () => number

  private checkNextBase(orchyProperties?: any) {
    if (!orchyProperties.nextBase) {
      throw new Error('nextBase has not been defined')
    }
  }

  private patchContent(orchyProperties: any | DocumentFragment) {
    this.getContainer()
      .querySelectorAll(RELATIVE_SRC_SELECTOR)
      .forEach(element => element.setAttribute('src', orchyProperties.nextBase + element.getAttribute('src')))
  }

  private async manageTemplate(orchyProperties?: any): Promise<void> {
    const importResult = await importHtml(orchyProperties)

    const importedTemplate = document.createRange().createContextualFragment(importResult.template)

    const container = this.getContainer()
    container.replaceChildren(importedTemplate)

    const proxy = createProxy(container)
    await importResult.execScripts(proxy, true, {scopedGlobalVariables: PROXIFIED_GLOBALS})
  }

  async mount(orchyProperties?: any): Promise<void> {
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
    'orchy-next-plugin': OrchyStoragePlugin
  }

  interface Window {
    next: any;
  }
}
