import { listAiConversations } from '@utils/ai'
import { GptProvider } from '@components/gpt/provider'
import type { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
    const initialConversations = await listAiConversations().catch(() => [])

    return (
        <GptProvider initialConversations={initialConversations}>
            <div className='h-[calc(100dvh-var(--h-topbar))] min-h-0 overflow-hidden'>
                {children}
            </div>
        </GptProvider>
    )
}
