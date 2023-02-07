import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
import {customElement} from 'lit/decorators.js'

import {importHtml} from './importHtml'

const RELATIVE_SRC_SELECTOR = '[src^="/"]'

@customElement('orchy-next-plugin')
export class OrchyStoragePlugin extends OrchySpaAdapter {
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

  private popStateHandlerBuilder = () => {
    let previousHistoryLength = history.length
    return ({url, as, options}: any) => {
      if (history.length === previousHistoryLength) {
        window.next.router.replace(url, as, options)
        previousHistoryLength--
      } else {
        previousHistoryLength = history.length
      }
      return false
    }
  }

  private async manageTemplate(orchyProperties?: any): Promise<void> {
    const importResult = await importHtml(orchyProperties)

    const importedTemplate = document.createRange().createContextualFragment(importResult.template)

    this.getContainer().replaceChildren(importedTemplate)
    await importResult.execScripts()
    setTimeout(() => window.next.router.beforePopState(this.popStateHandlerBuilder()), 0)
  }

  async mount(orchyProperties?: any): Promise<void> {
    this.checkNextBase(orchyProperties)
    await this.manageTemplate(orchyProperties)

    this.getContainer().addEventListener('DOMSubtreeModified', () =>
      setTimeout(() => this.patchContent(orchyProperties), 0)
    )
  }

  async unmount(): Promise<void> {
    this.getContainer().innerHTML = ''
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
