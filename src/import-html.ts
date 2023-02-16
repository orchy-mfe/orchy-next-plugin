import importHTML, {ImportEntryOpts} from 'import-html-entry'
import {lightJoin} from 'light-join'

const NEXT_DATA = '__NEXT_DATA__'
const HTML_COMMENTS_REGEX = /<!--(.*?)-->/g

const enrichNextData = (orchyProperties: any, nextDataElement: HTMLElement) => {
    const configContent = JSON.parse(nextDataElement.innerText)
    configContent.assetPrefix = orchyProperties.nextBase
    nextDataElement.innerText = JSON.stringify(configContent)
}

const importHtmlBuilder = (orchyProperties: any): ImportEntryOpts => {
    return {
        getTemplate: (template: string) => {
            const parsedTemplate = new DOMParser().parseFromString(template, 'text/html')
            const nextDataElement = parsedTemplate.getElementById(NEXT_DATA)!
            enrichNextData(orchyProperties, nextDataElement)

            return parsedTemplate.documentElement.innerHTML
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