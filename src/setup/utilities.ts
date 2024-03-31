import pino from 'pino'

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            minimumLevel: 'info'
        }
    }
})

export function titleCase(text: string) {
    return text
        .toLocaleLowerCase('tr-TR')
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1))
        .join(' ')
}

export function stringify (obj: unknown) {
    return JSON.stringify(obj, null, 4)
}

export function isArray (v: unknown): v is unknown[] {
    return (!!v) && (v.constructor === Array)
}

export function isObject (v: unknown): v is object {
    return (!!v) && (v.constructor === Object)
}
