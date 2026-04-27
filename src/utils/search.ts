export function normalizeEngine(value?: string | null, fallback: EngineKey = 'google'): EngineKey {
    if (value === 'duckduckgo' || value === 'brave' || value === 'google') {
        return value
    }

    return fallback
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = ''

    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }

    return bytes
}

export function encodeSearchPayload(query: string, engine: EngineKey): string {
    const encoder = new TextEncoder()
    return toBase64Url(encoder.encode(JSON.stringify({ query, engine })))
}

export function decodeSearchPayload(token: string): { query: string; engine: EngineKey } | null {
    try {
        const decodedBytes = fromBase64Url(token)
        const decoder = new TextDecoder()
        const parsed = JSON.parse(decoder.decode(decodedBytes))

        if (typeof parsed.query !== 'string') {
            return null
        }

        return {
            query: parsed.query,
            engine: normalizeEngine(parsed.engine)
        }
    } catch {
        return null
    }
}

export function buildEngineUrl(query: string, engine: EngineKey): string {
    const encodedQuery = encodeURIComponent(query)

    switch (engine) {
        case 'duckduckgo': return `https://duckduckgo.com/?q=${encodedQuery}`
        case 'google': return `https://www.google.com/search?q=${encodedQuery}`
        default: return `https://search.brave.com/search?q=${encodedQuery}`
    }
}
