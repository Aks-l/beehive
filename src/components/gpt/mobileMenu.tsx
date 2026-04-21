'use client'

import clsx from '@utils/clsx'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Menu from './menu/menu'

type MobileMenuProps = {
    text: AIText
    isLoadingConversations: boolean
    conversations: ChatConversationSummary[]
    loadConversations: (background?: boolean) => void
    id: string
    identity?: AIIdentity
}

export default function MobileMenu({
    text,
    isLoadingConversations,
    conversations,
    loadConversations,
    id,
    identity,
}: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(false)
    }, [id])

    useEffect(() => {
        function handleOpen() {
            setIsOpen(true)
        }

        window.addEventListener('open-ai-mobile-menu', handleOpen)
        return () => window.removeEventListener('open-ai-mobile-menu', handleOpen)
    }, [])

    return (
        <>
            <div
                className={clsx(
                    'fixed inset-0 z-950 1000px:hidden transition',
                    isOpen ? 'pointer-events-auto' : 'pointer-events-none'
                )}
            >
                <button
                    type='button'
                    aria-label='Close menu'
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        'absolute inset-0 cursor-pointer bg-black/25 transition-opacity duration-200',
                        isOpen ? 'opacity-100' : 'opacity-0'
                    )}
                />
                <div
                    className={clsx(
                        `absolute inset-y-0 left-0 flex w-[min(88vw,22rem)] min-h-0 flex-col
                        overflow-hidden border-r border-(--color-border-default) shadow-xl
                        bg-(--color-bg-topbar-open)
                        supports-[backdrop-filter:blur(0px)]:bg-(--color-bg-topbar)
                        supports-[backdrop-filter:blur(0px)]:backdrop-blur-xl
                        transition duration-200 ease-out`,
                        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                    )}
                >
                    <div className='flex items-center justify-end border-b border-(--color-border-default) px-4 py-3'>
                        <button
                            type='button'
                            aria-label='Close menu'
                            onClick={() => setIsOpen(false)}
                            className={`
                                cursor-pointer rounded-(--border-radius) p-2
                                text-(--color-text-main) transition
                                hover:bg-(--color-bg-main)
                            `}
                        >
                            <X className='h-5 w-5' />
                        </button>
                    </div>
                    <div className='min-h-0 flex-1'>
                        <Menu
                            text={text}
                            isLoadingConversations={isLoadingConversations}
                            conversations={conversations}
                            loadConversations={loadConversations}
                            id={id}
                            identity={identity}
                            className='h-full bg-transparent'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
