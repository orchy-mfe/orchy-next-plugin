import {MicroFrontendProperties} from '@orchy-mfe/models'

export type NextPluginProps = {
    nextBase: string
}

export const beforePopStateAdapter = (window: Window, orchyProperties?: MicroFrontendProperties<NextPluginProps>) => {
    let lastUrl: string | undefined = undefined
    return ({url, as, options}: any) => {
        const urlWithoutBase = url.replace(orchyProperties!.basePath, '') || '/'
        if (lastUrl !== urlWithoutBase) {
            window.next.router.replace(urlWithoutBase, as, options)
            lastUrl = urlWithoutBase
        }
        return false
    }
}

export const popStateAdapter = (event: any) => {
    if(!event.state.__N) {
        event.state.__N = true
        event.state.as = location.pathname
        event.state.url = location.pathname
        event.state.options = {}
    }
}