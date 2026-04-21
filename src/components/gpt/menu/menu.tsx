import {
    deleteAiConversation,
    importAiConversationsFromSession,
    listDeletedAiConversations,
    restoreAiConversation,
    shareAiConversation
} from '@utils/ai'
import { Ellipsis, MessageSquarePlus, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from 'uibee/components'
import MenuBar from './menuBar'
import Marquee from '@components/music/marquee'

type MenuProps = {
    text: AIText
    isLoadingConversations: boolean
    conversations: ChatConversationSummary[]
    loadConversations: (background?: boolean) => void
    id: string
    identity?: AIIdentity
}

export default function Menu({
    text,
    isLoadingConversations,
    conversations,
    loadConversations,
    id,
    identity,
}: MenuProps) {
    const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)
    const [restoringConversationId, setRestoringConversationId] = useState<string | null>(null)
    const [sidebar, setSidebar] = useState<string | null>(null)
    const [showDeleted, setShowDeleted] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [deletedConversations, setDeletedConversations] = useState<ChatConversationSummary[]>([])
    const router = useRouter()

    useEffect(() => {
        if (!showDeleted) {
            return
        }

        void loadDeletedConversations()
    }, [showDeleted])

    async function loadDeletedConversations() {
        try {
            setDeletedConversations(await listDeletedAiConversations())
        } catch (error) {
            console.error('Failed to load deleted conversations', error)
        }
    }

    async function handleDeleteConversation(event: React.MouseEvent, conversationId: string) {
        event.stopPropagation()

        try {
            setDeletingConversationId(conversationId)
            await deleteAiConversation(conversationId)
            await Promise.all([
                loadConversations(true),
                showDeleted ? loadDeletedConversations() : Promise.resolve(),
            ])

            if (conversationId === id) {
                router.push('/ai')
            }
        } catch (error) {
            console.error('Failed to delete conversation', error)
        } finally {
            setDeletingConversationId(null)
        }
    }

    async function handleRestoreConversation(event: React.MouseEvent, conversationId: string) {
        event.stopPropagation()

        try {
            setRestoringConversationId(conversationId)
            await restoreAiConversation(conversationId)
            await Promise.all([loadConversations(true), loadDeletedConversations()])
        } catch (error) {
            console.error('Failed to restore conversation', error)
        } finally {
            setRestoringConversationId(null)
        }
    }

    function handleMenuItemSidebar(event: React.MouseEvent, conversationId: string) {
        if (sidebar === conversationId) {
            setSidebar(null)
            return
        }
        event.stopPropagation()
        setSidebar(conversationId)
    }

    async function handleShareConversation(event: React.MouseEvent, conversationId: string) {
        event.stopPropagation()

        try {
            setSidebar(conversationId)
            const { shareToken } = await shareAiConversation(conversationId)
            await navigator.clipboard.writeText(`${window.location.origin}/ai/shared/${shareToken}`)
        } catch (error) {
            console.error('Failed to share conversation', error)
        } finally {
            setSidebar(null)
        }
    }

    async function handleImportSession(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!sessionId?.trim()) {
            return
        }

        try {
            await importAiConversationsFromSession(sessionId.trim())
            loadConversations(true)
            setSessionId('')
        } catch (error) {
            console.error('Failed to import conversations from session', error)
        }
    }

    function getConversationClassName(isActive: boolean) {
        return isActive
            ? 'border-(--color-primary) bg-grey-700/10'
            : `border-transparent bg-transparent
                hover:border-(--color-border-default)
                hover:bg-(--color-bg-body)`
    }

    function getDeleteIconClassName(conversationId: string) {
        return deletingConversationId === conversationId
            ? 'pointer-events-none opacity-100'
            : 'cursor-pointer'
    }

    const visibleConversations = showDeleted ? deletedConversations : conversations

    return (
        <aside className={`relative flex min-h-0 flex-col p-6 before:absolute
            before:content-[''] before:w-[2.6rem] before:h-[2.6rem]
            before:border-t-[0.7rem] before:border-r-[0.7rem] before:border-b-0
            before:border-(--color-border-default) before:border-l-0
            before:top-0 before:right-0 before:transition`}
        >
            {/* new chat */}
            <Link
                href='/ai'
                className='flex items-center gap-2 rounded-lg py-2 text-sm font-semibold
                    text-(--color-text-main) transition hover:bg-(--color-bg-main)'
            >
                <MessageSquarePlus className='h-4 w-4' />
                {text.newChat}
            </Link>

            {/* previous chats header */}
            <div className='mt-4 flex items-center justify-between'>
                <h2 className='text-xs font-semibold tracking-[0.18em] text-(--color-text-discreet)'>
                    {showDeleted ? text.deleted : text.previousChats}
                </h2>
                <span className='text-xs text-(--color-text-discreet)'>
                    {isLoadingConversations && !showDeleted ? text.loading : visibleConversations.length}
                </span>
            </div>

            {/* previous chats */}
            <div className='mt-2 flex-1 overflow-y-auto pb-24'>
                {visibleConversations.map((conversation) => {
                    const isActive = conversation.id === id

                    return (
                        <div
                            key={conversation.id}
                            role='button'
                            tabIndex={0}
                            onClick={() => {
                                if (!showDeleted) {
                                    router.push(`/ai/${conversation.id}`)
                                }
                            }}
                            onKeyDown={(event) => {
                                if ((event.key === 'Enter' || event.key === ' ') && !showDeleted) {
                                    event.preventDefault()
                                    router.push(`/ai/${conversation.id}`)
                                }
                            }}
                            className={`
                                group w-full rounded-lg p-2 text-left transition
                                cursor-pointer
                                ${getConversationClassName(isActive)}`}
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <Marquee
                                    className='truncate'
                                    innerClassName='text-sm text-neutral-500'
                                    text={conversation.title}
                                />
                                <span onMouseLeave={() => setSidebar(null)} className='flex shrink-0 items-center'>
                                    {!showDeleted ? (
                                        <>
                                            <button
                                                type='button'
                                                aria-label={`${text.share}: ${conversation.title}`}
                                                onClick={(event) => handleMenuItemSidebar(event, conversation.id)}
                                                className={`
                                                    rounded p-1 opacity-0 transition group-hover:opacity-60 hover:opacity-100 cursor-pointer
                                                    `}
                                            >
                                                <Ellipsis className='h-4 w-4' />
                                            </button>
                                            {sidebar === conversation.id && <MenuBar
                                                text={text}
                                                conversation={conversation}
                                                handleShareConversation={handleShareConversation}
                                                handleDeleteConversation={handleDeleteConversation}
                                                getDeleteIconClassName={getDeleteIconClassName}
                                            />}
                                        </>
                                    ) : (
                                        <button
                                            type='button'
                                            aria-label={`${text.restore}: ${conversation.title}`}
                                            onClick={(event) =>
                                                void handleRestoreConversation(event, conversation.id)}
                                            className='rounded p-1 opacity-0 transition group-hover:opacity-60 hover:opacity-100'
                                        >
                                            <Undo2
                                                className={`h-4 w-4 ${
                                                    restoringConversationId === conversation.id
                                                        ? 'text-(--color-primary)'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    )}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='absolute right-2 bottom-2 left-2 grid gap-2'>
                {identity?.isLoggedIn ? (
                    <form onSubmit={handleImportSession}>
                        <Input
                            name='text'
                            placeholder={text.loadFromSession}
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                            className='bottom-4 h-7'
                        />
                    </form>
                ) : null}
                <button
                    type='button'
                    onClick={() => setShowDeleted(prev => !prev)}
                    className={`
                        rounded-lg bg-(--color-bg-surface) py-1.75 text-sm 
                        text-(--color-text-main)
                    `}
                >
                    {showDeleted ? text.previousChats : text.deleted}
                </button>
            </div>
        </aside>
    )
}
