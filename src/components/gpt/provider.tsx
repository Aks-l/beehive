'use client'

import { createContext, useContext, type ReactNode } from 'react'
import useGptPageState from './useGptPageState'

const GptContext = createContext<GPT | null>(null)

export function GptProvider({
    children,
    initialConversations,
}: {
    children: ReactNode
    initialConversations: ChatConversationSummary[]
}) {
    const gpt = useGptPageState(initialConversations)

    return (
        <GptContext.Provider value={gpt}>
            {children}
        </GptContext.Provider>
    )
}

export function useGpt() {
    const value = useContext(GptContext)

    if (!value) {
        throw new Error('useGpt must be used within GptProvider')
    }

    return value
}
