import config from '@config'

export async function listAiConversations(): Promise<ChatConversationSummary[]> {
    return fetchAi<ChatConversationSummary[]>('/ai/conversations')
}

export async function getAiConversation(id: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>(`/ai/conversations/${id}`)
}

export async function createAiConversation(clientName: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>('/ai/conversations', {
        method: 'POST',
        body: JSON.stringify({ clientName }),
    })
}

export async function deleteAiConversation(id: string): Promise<void> {
    await fetchAi<void>(`/ai/conversations/${id}`, {
        method: 'DELETE',
    })
}

export async function switchAiConversationClient(id: string, clientName: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>(`/ai/conversations/${id}/switch-client`, {
        method: 'POST',
        body: JSON.stringify({ clientName }),
    })
}

async function fetchAi<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${config.url.beekeeper}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
        },
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to load AI data.')
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}
