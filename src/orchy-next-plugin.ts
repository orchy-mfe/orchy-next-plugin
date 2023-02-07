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

  private async manageTemplate(orchyProperties?: any): Promise<void> {
    const importResult = await importHtml(orchyProperties)

    const importedTemplate = document.createRange().createContextualFragment(importResult.template)
    importedTemplate.querySelectorAll(RELATIVE_SRC_SELECTOR).forEach(element => element.setAttribute('src', orchyProperties.nextBase + element.getAttribute('src')))

    this.getContainer().replaceChildren(importedTemplate)
    await importResult.execScripts()
  }

  async mount(orchyProperties?: any): Promise<void> {
    this.checkNextBase(orchyProperties)
    await this.manageTemplate(orchyProperties)
  }

  async unmount(): Promise<void> {
    this.getContainer().innerHTML = ''
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-next-plugin': OrchyStoragePlugin
  }
}
