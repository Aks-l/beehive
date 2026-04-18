import { Bot, Check, Copy } from 'lucide-react'
import { RefObject, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SCROLL_FOLLOW_THRESHOLD = 96

type MessagesProps = {
    isLoadingChat: boolean
    chatSession: ChatSession | null
    text: AIText
    shouldFollowRef: RefObject<boolean>
    id: string
}

export default function Messages({
    isLoadingChat,
    chatSession,
    text,
    shouldFollowRef,
    id
}: MessagesProps) {
    const messageViewportRef = useRef<HTMLDivElement | null>(null)
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
    const hasPlacedInitialScrollRef = useRef(false)

    async function handleCopy(message: GPT_ChatMessage) {
        try {
            await navigator.clipboard.writeText(message.content)
            setCopiedMessageId(message.id)
        } catch (error) {
            console.error('Failed to copy message', error)
        }
    }

    useEffect(() => {
        const viewport = messageViewportRef.current
        if (!viewport) {
            return
        }

        const handleScroll = () => {
            const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
            shouldFollowRef.current = distanceFromBottom < SCROLL_FOLLOW_THRESHOLD
        }

        handleScroll()
        viewport.addEventListener('scroll', handleScroll)

        return () => viewport.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const viewport = messageViewportRef.current
        if (!viewport || !chatSession) {
            return
        }

        if (!hasPlacedInitialScrollRef.current) {
            viewport.scrollTop = viewport.scrollHeight
            hasPlacedInitialScrollRef.current = true
            shouldFollowRef.current = true
            return
        }

        if (chatSession.isSending && shouldFollowRef.current) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [chatSession?.conversationId, chatSession?.isSending, chatSession?.messages])

    useEffect(() => {
        if (!copiedMessageId) {
            return
        }

        const timeout = setTimeout(() => setCopiedMessageId(null), 600)
        return () => clearTimeout(timeout)
    }, [copiedMessageId])

    useEffect(() => {
        hasPlacedInitialScrollRef.current = false
        shouldFollowRef.current = true
    }, [id])

    return (
        <div
            ref={messageViewportRef}
            className='flex-1 overflow-y-auto px-5 py-5 1000px:px-8'
        >
            {isLoadingChat && !chatSession ? (
                <div className='flex h-full items-center justify-center text-sm text-(--color-text-discreet)'>
                    {text.loadingConversation}
                </div>
            ) : !chatSession ? (
                <div className='flex h-full flex-col items-center justify-center gap-3 text-center'>
                    <Bot className='h-10 w-10 text-(--color-primary)' />
                    <div>
                        <p className='font-semibold text-(--color-text-main)'>
                            {text.notFoundTitle}
                        </p>
                        <p className='text-sm text-(--color-text-discreet)'>
                            {text.notFoundDescription}
                        </p>
                    </div>
                </div>
            ) : (
                <div className='mx-auto flex min-h-full w-full max-w-5xl flex-col justify-end gap-4'>
                    {chatSession.messages.map((message) => (
                        <article
                            key={message.id}
                            className={`group relative max-w-[90%] rounded-lg p-2.5
                                ${getMessageClassName(message)}`}
                        >
                            <div
                                className='prose prose-sm max-w-none select-text text-current
                                    prose-p:my-2 prose-pre:overflow-x-auto
                                    prose-pre:rounded-(--border-radius)
                                    prose-pre:bg-black/80 prose-pre:p-4'
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content || '...'}
                                </ReactMarkdown>
                            </div>
                            {message.role === 'assistant' ? (
                                <div className='flex'>
                                    <button
                                        type='button'
                                        aria-label={text.copy}
                                        title={copiedMessageId === message.id ? text.copied : text.copy}
                                        onClick={() => handleCopy(message)}
                                        className='pt-1'
                                    >
                                        {copiedMessageId === message.id
                                            ? <Check className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />
                                            : <Copy className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />}
                                    </button>
                                </div>
                            ) : null}
                            {message.role === 'user' ? (
                                <button
                                    type='button'
                                    aria-label={text.copy}
                                    title={copiedMessageId === message.id ? text.copied : text.copy}
                                    onClick={() => handleCopy(message)}
                                    className='absolute -bottom-5 right-1 opacity-0 transition
                                        group-hover:opacity-100 cursor-pointer'
                                >
                                    {copiedMessageId === message.id
                                        ? <Check className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />
                                        : <Copy className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />}
                                </button>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

function getMessageClassName(message: GPT_ChatMessage) {
    if (message.role === 'user') {
        return 'ml-auto bg-(--color-bg-surface)/80 text-white'
    }

    if (message.role === 'system') {
        return `mx-auto w-full max-w-full border border-dashed shadow-none
            border-(--color-border-default) bg-(--color-bg-body)
            text-(--color-text-discreet)`
    }

    if (message.error) {
        return 'border border-red-200 bg-red-50 text-red-900 shadow-none'
    }

    return ''
}
