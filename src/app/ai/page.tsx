import { getClients } from '@utils/api'
import PageClient from './pageClient'
import { cookies } from 'next/headers'
import no from '@text/ai/no.json'
import en from '@text/ai/en.json'

export default async function page() {
    const cookieStore = await cookies()
    const clients = await getClients()
    const lang = (cookieStore.get('lang')?.value || 'no') as Lang
    const text = lang === 'no' ? no : en
    const random = Math.floor(Math.random() * text.ask.length - 1)
    const identity = {
        userId: cookieStore.get('user_id')?.value || null,
        userName: cookieStore.get('user_name')?.value || null,
        sessionId: cookieStore.get('ai_session_id')?.value || '',
        isLoggedIn: Boolean(cookieStore.get('access_token')?.value),
        hideTemporaryBanner: cookieStore.get('hideTemporaryAiBanner')?.value === 'true',
    }
    return <PageClient
        clients={clients}
        random={random}
        lang={lang}
        identity={identity}
    />
}
