import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
import importHTML, {ImportEntryOpts} from 'import-html-entry'
import {lightJoin} from 'light-join'
import {customElement} from 'lit/decorators.js'

const HTML_COMMENTS_REGEX = /<!--(.*?)-->/g
const RELATIVE_SRC_SELECTOR = '[src^="/"]'

const IMPORT_HTML_OPTIONS: ImportEntryOpts = {
  postProcessTemplate: (templateResult) => {
    templateResult.template = templateResult.template.replace(HTML_COMMENTS_REGEX, '')
    return templateResult
  }
}

@customElement('orchy-next-plugin')
export class OrchyStoragePlugin extends OrchySpaAdapter {
  private checkNextBase(orchyProperties?: any) {
    if (!orchyProperties.nextBase) {
      throw new Error('nextBase has not been defined')
    }
  }

  private retrieveImportUrl(orchyProperties?: any): string {
    const pathname = location.pathname.replace(orchyProperties.basePath, '')
    return lightJoin(orchyProperties.nextBase, pathname)
  }

  private async manageTemplate(orchyProperties?: any): Promise<void> {
    const importResult = await importHTML(this.retrieveImportUrl(orchyProperties), IMPORT_HTML_OPTIONS)

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
