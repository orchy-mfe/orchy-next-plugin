const PROXY_AVOID_KEYS = ['top', 'parent', 'window', 'self', 'globalThis']

export const createWindowProxy = () => {
    const fakeWindow = Object.create(null)

    const proxy: any = new Proxy(window, {
        get: (target: Window, property: string) => {
            if (PROXY_AVOID_KEYS.includes(property)) {
                return proxy
            }

            const returnValue = fakeWindow[property] || target[property]

            if(typeof returnValue === 'function') {
                return returnValue.bind(target)
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

    return proxy
}