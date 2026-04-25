import { Bot, Check, Copy } from 'lucide-react'
import Link from 'next/link'
import { RefObject, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SCROLL_FOLLOW_THRESHOLD = 96

type MessagesProps = {
    isLoadingChat: boolean
    chatSession: ChatSession | null
    text: AIText
    shouldFollowRef: RefObject<boolean>
    id: string
}

type MarkdownCodeProps = {
    children: ReactNode
    className?: string
    text: AIText
}

type AssistantMessageProps = {
    text: AIText
    copiedMessageId: string | null
    message: GPT_ChatMessage
    handleCopy: (message: GPT_ChatMessage) => Promise<void>
}

type UserMessageProps = {
    text: AIText
    copiedMessageId: string | null
    message: GPT_ChatMessage
    handleCopy: (message: GPT_ChatMessage) => Promise<void>
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
    const markdownComponents = useMemo<Components>(() => ({
        h1: ({children}) => <h1 className='my-4 text-2xl font-semibold leading-tight text-current'>{children}</h1>,
        h2: ({children}) => <h2 className='my-4 text-[1.35rem] font-semibold leading-tight text-current'>{children}</h2>,
        h3: ({children}) => <h3 className='my-3 text-[1.2rem] font-semibold leading-tight text-current'>{children}</h3>,
        h4: ({children}) => <h4 className='my-3 text-[1.05rem] font-semibold leading-tight text-current'>{children}</h4>,
        h5: ({children}) => <h5 className='my-2 text-sm font-semibold text-current'>{children}</h5>,
        h6: ({children}) => <h6 className='text-sm font-semibold text-current'>{children}</h6>,
        p: ({children}) => <p className='text-current'>{children}</p>,
        strong: ({children}) => <strong className='font-semibold text-current'>{children}</strong>,
        em: ({children}) => <em className='text-current'>{children}</em>,
        ul: ({children}) => <ul className='my-2 ml-5 list-disc'>{children}</ul>,
        ol: ({children}) => <ol className='my-2 ml-5 list-decimal'>{children}</ol>,
        li: ({children}) => <li className='my-1 pl-1 text-current'>{children}</li>,
        a: ({children, href}) => (
            <a
                href={href}
                target='_blank'
                rel='noreferrer'
                className='underline underline-offset-3 text-current'
            >
                {children}
            </a>
        ),
        code: ({children, className}) => (
            <MarkdownCode className={className} text={text}>
                {children}
            </MarkdownCode>
        )
    }), [text])

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

        function handleScroll() {
            if (!viewport) {
                return
            }

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
        <div ref={messageViewportRef} className='flex-1 overflow-y-auto px-5 py-4 1000px:px-8'>
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
                        <div className='flex gap-1'>
                            <p className='text-sm text-(--color-text-discreet)'>
                                {text.notFoundDescription}
                            </p>
                            <Link href='/ai' className='text-sm text-(--color-text-discreet) underline!'>
                                {text.notFoundAction}
                            </Link>
                        </div>
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
                            <div className='max-w-none select-text wrap-break-word text-current'>
                                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                                    {message.content || '...'}
                                </ReactMarkdown>
                            </div>
                            {message.role === 'assistant' && <AssistantMessage
                                text={text}
                                copiedMessageId={copiedMessageId}
                                message={message}
                                handleCopy={handleCopy}
                            />}
                            {message.role === 'user' && <UserMessage
                                text={text}
                                copiedMessageId={copiedMessageId}
                                message={message}
                                handleCopy={handleCopy}
                            />}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

function AssistantMessage({ text, copiedMessageId, message, handleCopy }: AssistantMessageProps) {
    if (message.error) {
        return
    }

    return (
        <div className='flex'>
            <button
                type='button'
                aria-label={text.copy}
                title={copiedMessageId === message.id ? text.copied : text.copy}
                onClick={() => handleCopy(message)}
                className='pt-1'
            >
                {copiedMessageId === message.id
                    ? <Check className={`
                        h-4 w-4 text-current opacity-55
                        hover:opacity-100 cursor-pointer
                        stroke-login-orange
                    `} />
                    : <Copy className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />}
            </button>
        </div>
    )
}

function UserMessage({ text, copiedMessageId, message, handleCopy }: UserMessageProps) {
    return (
        <button
            type='button'
            aria-label={text.copy}
            title={copiedMessageId === message.id ? text.copied : text.copy}
            onClick={() => handleCopy(message)}
            className='absolute -bottom-5 right-1 opacity-0 transition
                group-hover:opacity-100 cursor-pointer'
        >
            {copiedMessageId === message.id
                ? <Check
                    className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer stroke-login-orange'
                />
                : <Copy className='h-4 w-4 text-current opacity-55 hover:opacity-100 cursor-pointer' />}
        </button>
    )
}

function getMessageClassName(message: GPT_ChatMessage) {
    if (message.role === 'user') {
        return 'ml-auto bg-(--color-bg-surface)/80'
    }

    if (message.error) {
        return 'border border-login-orange bg-login-orange/20 text-login-orange'
    }

    return ''
}

function MarkdownCode({ children, className, text }: MarkdownCodeProps) {
    const [copied, setCopied] = useState(false)
    const value = getCodeText(children)
    const multiline = Boolean(className) || value.includes('\n')

    useEffect(() => {
        if (!copied) {
            return
        }

        const timeout = setTimeout(() => setCopied(false), 600)
        return () => clearTimeout(timeout)
    }, [copied])

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
        } catch (error) {
            console.error('Failed to copy code', error)
        }
    }

    if (!multiline) {
        return (
            <span
                className='group/code relative inline-flex max-w-full items-center rounded-(--border-radius)
                    border border-[#30363d] bg-[#161b22] hover:pr-4 align-baseline text-[#e6edf3]
                    in-[.light]:border-[#d0d7de] in-[.light]:bg-[#f6f8fa] in-[.light]:text-[#24292f]'
            >
                <code className='overflow-x-auto px-2 py-1 font-mono text-[0.9em]'>
                    {value}
                </code>
                <button
                    type='button'
                    aria-label={text.copy}
                    title={copied ? text.copied : text.copy}
                    onClick={handleCopy}
                    className='absolute top-1/2 right-1.25 -translate-y-1/2 opacity-0 transition
                        group-hover/code:opacity-100 cursor-pointer'
                >
                    {copied
                        ? <Check className='h-3.5 w-3.5 opacity-65 hover:opacity-100 stroke-login-orange' />
                        : <Copy className='h-3.5 w-3.5 opacity-65 hover:opacity-100' />}
                </button>
            </span>
        )
    }

    return (
        <div
            className='group/code relative my-2 overflow-hidden rounded-(--border-radius-large)
                border border-[#30363d] bg-[#0d1117] text-[#e6edf3]
                in-[.light]:border-[#d0d7de] in-[.light]:bg-[#f6f8fa] in-[.light]:text-[#24292f]'
        >
            <pre className='overflow-x-auto p-2 text-[0.92rem] leading-6'>
                <code className={`font-mono ${className || ''}`.trim()}>
                    {value}
                </code>
            </pre>
            <button
                type='button'
                aria-label={text.copy}
                title={copied ? text.copied : text.copy}
                onClick={handleCopy}
                className={`
                    absolute ${value.includes('\n') ? 'right-2 bottom-2' : 'right-2 bottom-[30%]'}
                    opacity-0 transition group-hover/code:opacity-100 cursor-pointer`}
            >
                {copied
                    ? <Check className='h-4 w-4 opacity-65 hover:opacity-100 stroke-login-orange' />
                    : <Copy className='h-4 w-4 opacity-65 hover:opacity-100' />}
            </button>
        </div>
    )
}

function getCodeText(children: ReactNode) {
    return String(children).replace(/\n$/, '')
}
