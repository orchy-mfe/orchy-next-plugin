import importHTML, {ImportEntryOpts} from 'import-html-entry'
import {lightJoin} from 'light-join'

import {NextPluginProps} from './next-router-adapters'

const NEXT_DATA = '__NEXT_DATA__'
const HTML_COMMENTS_REGEX = /<!--(.*?)-->/g
const RELATIVE_LINK_HREF_SELECTOR = 'link[href^="/"]'
const RELATIVE_SRC_SELECTOR = '[src^="/"]'
const RELATIVE_A_HREF_SELECTOR = 'a[href^="/"]'

const enrichNextData = (orchyProperties: NextPluginProps, nextDataElement: HTMLElement) => {
    const configContent = JSON.parse(nextDataElement.innerText)
    configContent.assetPrefix = orchyProperties.nextBase
    nextDataElement.innerText = JSON.stringify(configContent)
}

export const patchElement = (htmlElement: HTMLElement | Document, orchyProperties: NextPluginProps) => {
    htmlElement.querySelectorAll<HTMLLinkElement>(RELATIVE_LINK_HREF_SELECTOR).forEach(link => {
        link.setAttribute('href', lightJoin(orchyProperties.nextBase, link.getAttribute('href')))
    })

    htmlElement
        .querySelectorAll<HTMLScriptElement>(RELATIVE_SRC_SELECTOR)
        .forEach(element => element.setAttribute('src', lightJoin(orchyProperties!.nextBase!, element.getAttribute('src')!)))

    htmlElement
        .querySelectorAll<HTMLAnchorElement>(RELATIVE_A_HREF_SELECTOR)
        .forEach(element => {
            const path = lightJoin(orchyProperties!.basePath, element.getAttribute('href'))
            element.setAttribute('href', lightJoin(window.location.origin, path))
            element.addEventListener('click', (event: Event) => {
                event.preventDefault()
                event.stopPropagation()
                history.pushState({path}, '', path)
            })
        })
}

const importHtmlBuilder = (orchyProperties: NextPluginProps): ImportEntryOpts => {
    return {
        getTemplate: (template: string) => {
            const parsedTemplate = new DOMParser().parseFromString(template, 'text/html')
            const nextDataElement = parsedTemplate.getElementById(NEXT_DATA)!
            enrichNextData(orchyProperties, nextDataElement)

            patchElement(parsedTemplate, orchyProperties)

            return parsedTemplate.documentElement.innerHTML
        },
        postProcessTemplate: (templateResult) => {
            templateResult.template = templateResult.template.replace(HTML_COMMENTS_REGEX, '')
            return templateResult
        }
    }
}

const retrieveImportUrl = (orchyProperties: NextPluginProps): string => {
    const pathname = location.pathname.replace(orchyProperties.basePath, '')
    return lightJoin(orchyProperties.nextBase, pathname)
}

export const importHtml = (orchyProperties?: NextPluginProps) => importHTML(retrieveImportUrl(orchyProperties!), importHtmlBuilder(orchyProperties!))