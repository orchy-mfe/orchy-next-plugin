import OrchySpaAdapter from '@orchy-mfe/spa-adapter'
import importHTML, {ImportEntryOpts} from 'import-html-entry'
import {lightJoin} from 'light-join'
import {customElement} from 'lit/decorators.js'

const HTML_COMMENTS_REGEX = /<!--(.*?)-->/g
const RELATIVE_HREF_SELECTOR = '[href^="/"]'
const RELATIVE_SRC_SELECTOR = '[src^="/"]'

const IMPORT_HTML_OPTIONS: ImportEntryOpts = {
  postProcessTemplate: (templateResult) => {
    templateResult.template = templateResult.template.replace(HTML_COMMENTS_REGEX, '')
    return templateResult
  }
}

@customElement('orchy-next-plugin')
export class OrchyStoragePlugin extends OrchySpaAdapter {
  private checkNextPath(orchyProperties?: any) {
    if (!orchyProperties.nextPath) {
      throw new Error('nextPath has not been defined')
    }
  }

  private async manageTemplate(orchyProperties?: any, path = '/'): Promise<void> {
    const importResult = await importHTML(lightJoin(orchyProperties.nextPath, path), IMPORT_HTML_OPTIONS)
    importResult.execScripts()

    const importedTemplate = document.createRange().createContextualFragment(importResult.template)
    importedTemplate.querySelectorAll(RELATIVE_HREF_SELECTOR).forEach(element => element.setAttribute('href', orchyProperties.nextPath + element.getAttribute('href')))
    importedTemplate.querySelectorAll(RELATIVE_SRC_SELECTOR).forEach(element => element.setAttribute('src', orchyProperties.nextPath + element.getAttribute('src')))

    this.getContainer().replaceChildren(importedTemplate)
  }

  async mount(orchyProperties?: any): Promise<void> {
    this.checkNextPath(orchyProperties)
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
