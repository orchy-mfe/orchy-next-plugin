export const beforePopStateAdapter = () => {
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

export const popStateAdapter = (event: any) => {
    if(!event.state.__N) {
        event.state.__N = true
        event.state.as = location.pathname
        event.state.url = location.pathname
        event.state.options = {}
    }
}