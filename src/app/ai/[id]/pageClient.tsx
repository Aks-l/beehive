'use client'

import en from '@text/ai/en.json'
import no from '@text/ai/no.json'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    createChatSessionFromStoredConversation,
    getStoredChatSessionSnapshot
} from '@components/gpt/useGptPageState'
import { useGpt } from '@components/gpt/provider'
import findHighestTPSClient from '@utils/findHighestTPSClient'
import Prompt from '@components/gpt/prompt'
import Messages from '@components/gpt/messages'
import UnavailableBanner from '@components/gpt/unavailableBanner'
import Menu from '@components/gpt/menu/menu'
import AnonymousDisclaimer from '@components/gpt/anonymousDisclaimer'
import MobileMenu from '@components/gpt/mobileMenu'

export default function PageClient({
    id,
    lang,
    initialConversation,
    initialClientsCount,
    identity,
}: {
    id: string
    lang: Lang
    initialConversation: StoredConversation | null
    initialClientsCount: number
    identity: AIIdentity
}) {
    const {
        chatSession: liveChatSession,
        clients,
        conversations,
        isConnected,
        isLoadingChat,
        isLoadingConversations,
        loadConversations,
        restoreChat,
        sendPrompt,
        switchConversationClient
    } = useGpt()
    const text = ((lang === 'no' ? no : en).conversation) as AIText
    const [input, setInput] = useState('')
    const [selectedClient, setSelectedClient] = useState('')
    const [isSwitching, setIsSwitching] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const shouldFollowRef = useRef(true)
    const snapshotSession = useMemo(() => getStoredChatSessionSnapshot(id), [id])
    const fallbackSession = useMemo(
        () => initialConversation ? createChatSessionFromStoredConversation(initialConversation) : null,
        [initialConversation]
    )
    const chatSession = liveChatSession?.conversationId === id
        ? liveChatSession
        : snapshotSession?.conversationId === id
            ? snapshotSession
            : fallbackSession?.conversationId === id
                ? fallbackSession
                : liveChatSession

    useEffect(() => {
        if (!fallbackSession || fallbackSession.conversationId !== id) {
            void restoreChat(id)
        }
    }, [fallbackSession, id, restoreChat])

    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) {
            return
        }

        textarea.style.height = '0px'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`
    }, [input])

    const isActiveClientAvailable = useMemo(() => {
        if (!chatSession) {
            return false
        }

        if (!clients.length) {
            return initialClientsCount > 0
        }

        return clients.some((client) => client.name === chatSession.clientName)
    }, [chatSession, clients, initialClientsCount])

    const fallbackClient = useMemo(() => {
        if (!clients.length) {
            return null
        }

        return findHighestTPSClient(clients)
    }, [clients])

    useEffect(() => {
        if (!selectedClient && fallbackClient) {
            setSelectedClient(fallbackClient.name)
        }
    }, [fallbackClient, selectedClient])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!chatSession || !input.trim() || !isActiveClientAvailable) {
            return
        }

        shouldFollowRef.current = true

        const didSend = await sendPrompt(input, chatSession)
        if (didSend) {
            setInput('')
        }
    }

    async function handleSwitchClient() {
        if (!chatSession || !selectedClient) {
            return
        }

        try {
            setIsSwitching(true)
            shouldFollowRef.current = true
            await switchConversationClient(chatSession.conversationId, selectedClient)
        } finally {
            setIsSwitching(false)
        }
    }

    const showUnavailableBanner = Boolean(
        chatSession
        && ((clients.length > 0 && !isActiveClientAvailable)
            || (clients.length === 0 && initialClientsCount === 0))
    )

    return (
        <div className='page-section--without-gaps h-full min-h-0 overflow-hidden'>
            <div className='grid h-full min-h-0 grid-cols-6 overflow-hidden'>
                <Menu
                    text={text}
                    isLoadingConversations={isLoadingConversations}
                    conversations={conversations}
                    loadConversations={loadConversations}
                    id={id}
                    identity={identity}
                    className='hidden 1000px:flex'
                />

                <section className={`
                    relative col-span-6 flex h-full min-h-0 flex-col 
                    overflow-hidden bg-(--color-bg-main) pt-16 1000px:col-span-5
                    1000px:pt-0
                `}>
                    <MobileMenu
                        text={text}
                        isLoadingConversations={isLoadingConversations}
                        conversations={conversations}
                        loadConversations={loadConversations}
                        id={id}
                        identity={identity}
                    />
                    <AnonymousDisclaimer
                        identity={identity}
                        conversations={conversations}
                        text={text}
                    />

                    <UnavailableBanner
                        showUnavailableBanner={showUnavailableBanner}
                        chatSession={chatSession}
                        text={text}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        clients={clients}
                        isSwitching={isSwitching}
                        handleSwitchClient={handleSwitchClient}
                    />

                    <Messages
                        isLoadingChat={isLoadingChat}
                        chatSession={chatSession}
                        text={text}
                        shouldFollowRef={shouldFollowRef}
                        id={id}
                    />

                    <Prompt
                        handleSubmit={handleSubmit}
                        textareaRef={textareaRef}
                        input={input}
                        chatSession={chatSession}
                        isActiveClientAvailable={isActiveClientAvailable}
                        setInput={setInput}
                        text={text}
                    />

                    <div className='w-full px-5 pb-2 1000px:px-8'>
                        <div className='mx-auto h-12 w-full max-w-5xl'>
                            <div className='flex h-full items-center justify-center gap-2 rounded-lg bg-(--color-bg-surface) px-3'>
                                <div className='flex items-center gap-3 text-sm text-(--color-text-discreet)'>
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full
                                            ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    />
                                    {isConnected ? text.connected : text.reconnecting}
                                </div>
                                <div className='h-[70%] w-px bg-(--color-bg-surface-raised)' />
                                <p className='truncate text-sm text-(--color-text-discreet)'>
                                    {chatSession
                                        ? `${text.agent}: ${chatSession.clientName}`
                                        : isLoadingChat
                                            ? text.loadingConversation
                                            : text.notFound}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
