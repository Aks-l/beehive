import { Bot } from 'lucide-react'
import { getCookie } from 'utilbee'
import no from '@text/ai/no.json'
import en from '@text/ai/en.json'

export default function GPT_EmptyState() {
    const lang = (getCookie('lang') || 'no') as Lang
    const text = lang === 'no' ? no : en

    return (
        <div className={`
            mt-10 w-full rounded-2xl border border-grey-50/10 bg-grey-900/50
            px-6 py-10 text-center 1000px:mt-45
        `}>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-grey-50/5'>
                <Bot className='h-6 w-6 stroke stroke-primary-500' />
            </div>
            <h2 className='mt-4 font-semibold text-login-50'>{text.empty.title}</h2>
            <p className='mt-2 text-sm text-login-100'>{text.empty.description}</p>
            <p className='mt-2 text-xs text-login-200'>{text.empty.contact}</p>
        </div>
    )
}
