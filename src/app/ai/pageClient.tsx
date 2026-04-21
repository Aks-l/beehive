'use client'

import GPT_EmptyState from '@components/gpt/emptyState'
import GPTPreview from '@components/gpt/gptPreview'
import Menu from '@components/gpt/menu/menu'
import MobileMenu from '@components/gpt/mobileMenu'
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
    const text = ((lang === 'no' ? no : en).conversation) as AIText

    return (
        <div className='page-section--without-gaps h-full min-h-0 overflow-hidden'>
            <div className='grid h-full min-h-0 grid-cols-6 overflow-hidden'>
                <Menu
                    text={text}
                    isLoadingConversations={gpt.isLoadingConversations}
                    conversations={gpt.conversations}
                    loadConversations={gpt.loadConversations}
                    id=''
                    identity={identity}
                    className='hidden 1000px:flex'
                />

                <section className={`
                    page-container relative col-span-6 h-full min-h-0
                    overflow-hidden bg-(--color-bg-main) 1000px:col-span-5
                `}>
                    <MobileMenu
                        text={text}
                        isLoadingConversations={gpt.isLoadingConversations}
                        conversations={gpt.conversations}
                        loadConversations={gpt.loadConversations}
                        id=''
                        identity={identity}
                    />
                    <div className={`
                        page-section--normal flex h-full min-h-0 flex-col 
                        overflow-hidden px-2 pt-16 1000px:px-0 1000px:-mt-13 
                        1000px:pt-0
                    `}>
                        <h1 className='heading-1 heading-1--top-left-corner text-[2rem] 800px:text-inherit'>
                            Login AI
                        </h1>
                        <h1 className={`${comicNeue.className} hidden text-right text-lg pr-18 -mt-25 text-(--color-primary) 1000px:block`}>
                            #GjermundAI
                        </h1>
                        {clients > 0 ? <GPTPreview gpt={gpt} random={random} lang={lang} /> : <GPT_EmptyState />}
                    </div>
                </section>
            </div>
        </div>
    )
}
