'use client'

import GPT_EmptyState from '@components/gpt/emptyState'
import GPTPreview from '@components/gpt/gptPreview'
import Menu from '@components/gpt/menu'
import { useGpt } from '@components/gpt/provider'
import { Comic_Neue } from 'next/font/google'
import en from '@text/ai/en.json'
import no from '@text/ai/no.json'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'] })

export default function page({
    clients,
    random,
    lang,
    identity
}: {
    clients: number
    random: number
    lang: Lang
    identity: AIIdentity
}) {
    const gpt = useGpt()
    const text = (lang === 'no' ? no : en).conversation

    return (
        <div className='page-section--without-gaps h-full min-h-0'>
            <div className='grid h-full min-h-0 grid-cols-7'>
                <Menu
                    text={text}
                    isLoadingConversations={gpt.isLoadingConversations}
                    conversations={gpt.conversations}
                    loadConversations={gpt.loadConversations}
                    id=''
                    identity={identity}
                />

                <section className='page-container min-h-[calc(100vh-var(--h-topbar))] bg-(--color-bg-main) col-span-6'>
                    <div className='page-section--normal flex flex-col'>
                        <h1 className='heading-1 heading-1--top-left-corner'>
                            Login AI
                        </h1>
                        <h1 className={`${comicNeue.className} text-right text-lg pr-18 -mt-25 text-(--color-primary)`}>#GjermundAI</h1>
                        {clients > 0 ? <GPTPreview gpt={gpt} random={random} lang={lang} /> : <GPT_EmptyState />}
                    </div>
                </section>
            </div>
        </div>
    )
}
