import { getClients } from '@utils/api'
import { getAiConversation } from '@utils/ai'
import PageClient from './pageClient'
import { cookies } from 'next/headers'

export default async function page({ params }: PromisedPageProps) {
    const id = String((await params).id)
    const cookieStore = await cookies()
    const lang = (cookieStore.get('lang')?.value || 'no') as Lang
    const identity = {
        userId: cookieStore.get('user_id')?.value || null,
        userName: cookieStore.get('user_name')?.value || null,
        sessionId: cookieStore.get('ai_session_id')?.value || '',
        isLoggedIn: Boolean(cookieStore.get('access_token')?.value),
        hideTemporaryBanner: cookieStore.get('hideTemporaryAiBanner')?.value === 'true',
    }
    const [initialConversation, initialClientsCount] = await Promise.all([
        getAiConversation(id).catch(() => null),
        getClients().catch(() => 0),
    ])

    return (
        <PageClient
            id={id}
            lang={lang}
            initialConversation={initialConversation}
            initialClientsCount={initialClientsCount}
            identity={identity}
        />
    )
}
