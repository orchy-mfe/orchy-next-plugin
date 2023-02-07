import importHTML, {ImportEntryOpts} from 'import-html-entry'
import {lightJoin} from 'light-join'

const NEXT_DATA = '__NEXT_DATA__'
const HTML_COMMENTS_REGEX = /<!--(.*?)-->/g

const fragmentStringifier = (fragment: DocumentFragment) => {
    const div = document.createElement('div')
    div.replaceChildren(fragment)

    return div.innerHTML
}

const enrichNextData = (orchyProperties: any, nextDataElement: HTMLElement) => {
    const configContent = JSON.parse(nextDataElement.innerText)
    configContent.assetPrefix = orchyProperties.nextBase
    nextDataElement.innerText = JSON.stringify(configContent)
}

const importHtmlBuilder = (orchyProperties: any): ImportEntryOpts => {
    return {
        getTemplate: (template: string) => {
            const templateFragment = document.createRange().createContextualFragment(template)
            const nextDataElement = templateFragment.getElementById(NEXT_DATA)!
            enrichNextData(orchyProperties, nextDataElement)

            return fragmentStringifier(templateFragment)
        },
        postProcessTemplate: (templateResult) => {
            templateResult.template = templateResult.template.replace(HTML_COMMENTS_REGEX, '')
            return templateResult
        }
    }
}

const retrieveImportUrl = (orchyProperties ?: any): string => {
    const pathname = location.pathname.replace(orchyProperties.basePath, '')
    return lightJoin(orchyProperties.nextBase, pathname)
}

export const importHtml = (orchyProperties: any) => importHTML(retrieveImportUrl(orchyProperties), importHtmlBuilder(orchyProperties))