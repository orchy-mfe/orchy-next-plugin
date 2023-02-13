import {execScripts} from 'import-html-entry'

const GLOBAL_CONTEXT = ['window', 'self', 'globalThis']
const PROXY_AVOID_KEYS = ['top', 'parent', ...GLOBAL_CONTEXT]
const DOCUMENT_REDIRECT_KEYS = ['querySelector', 'querySelectorAll', 'getElementById', 'body']
const SCRIPT_TAG = 'SCRIPT'

export const PROXIFIED_GLOBALS = [...GLOBAL_CONTEXT, 'document']

const patchContainer = (container: HTMLElement, window: Window) => {
    // @ts-expect-error only document has getElementById
    container.getElementById = (elementId: string) => container.querySelector(`#${elementId}`)

    // @ts-expect-error only document has body
    container.body = container

    const rawAppendChild = container.appendChild.bind(container)

    container.appendChild = (node: Node) => {
        if (node instanceof HTMLScriptElement && node.tagName === SCRIPT_TAG) {
            execScripts(null, [node.src], window).then(() => {
                node.onload?.(undefined as any)
            })
            return undefined as any
        } else {
            return rawAppendChild(node)
        }
    }
}

const createDocumentProxy = (container: HTMLElement, window: Window) => {
    patchContainer(container, window)

    const proxy: any = new Proxy(document, {
        get: (target: Document, property: string) => {
            const finalTarget = DOCUMENT_REDIRECT_KEYS.includes(property) ? container : target
            // @ts-expect-error document is not indexable
            const returnValue = finalTarget[property]

            if (typeof returnValue === 'function') {
                return returnValue.bind(finalTarget)
            }

            return returnValue
        },
        set: (target: Document, property: string, value: any) => {
            // @ts-expect-error document is not indexable
            target[property] = value

            return true
        }
    })

    return proxy
}

const createWindowProxy = () => {
    const fakeWindow = Object.create(null)

    const proxy: any = new Proxy(window, {
        get: (target: Window, property: any) => {
            if (PROXY_AVOID_KEYS.includes(property)) {
                return proxy
            }

            const returnValue = fakeWindow[property] || target[property]
            if(typeof returnValue === 'function') {
                const toBind = fakeWindow[property] ? fakeWindow : target
                return returnValue.bind(toBind)
            }
            return returnValue
        },
        set: (target: Window, property: string, value: any) => {
            const storeObject = property.startsWith('$') ? target : fakeWindow
            storeObject[property] = value

            return true
        },
        has: (target: any, property: string): boolean => {
            return fakeWindow[property] || target[property]
        }
    })

    return {fakeWindow, windowProxy: proxy}
}

type NextProxy = {
    [k in typeof PROXIFIED_GLOBALS[number]]: any
}

export const createProxy = (container: HTMLElement): NextProxy => {
    const {fakeWindow, windowProxy} = createWindowProxy()
    const documentProxy = createDocumentProxy(container, windowProxy)

    fakeWindow.document = documentProxy

    return {
        globalThis: windowProxy,
        self: windowProxy,
        window: windowProxy,
        document: documentProxy,
    }
}