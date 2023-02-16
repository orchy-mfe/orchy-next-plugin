export const beforePopStateAdapter = (window: Window) => {
    let lastUrl: string | undefined = undefined
    return ({url, as, options}: any) => {
        if(lastUrl !== url) {
            window.next.router.replace(url, as, options)
            lastUrl = url
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