import {
    deleteAiConversation,
    importAiConversationsFromSession,
    listDeletedAiConversations,
    restoreAiConversation,
    shareAiConversation
} from '@utils/ai'
import clsx from '@utils/clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from 'uibee/components'
import NewChatLink from './newChatLink'
import PreviousChatsHeader from './previousChatsHeader'
import PreviousChatsList from './previousChatsList'

type MenuProps = {
    text: AIText
    isLoadingConversations: boolean
    conversations: ChatConversationSummary[]
    loadConversations: (background?: boolean) => void
    id: string
    identity?: AIIdentity
    className?: string
}

export default function Menu({
    text,
    isLoadingConversations,
    conversations,
    loadConversations,
    id,
    identity,
    className,
}: MenuProps) {
    const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)
    const [restoringConversationId, setRestoringConversationId] = useState<string | null>(null)
    const [sidebar, setSidebar] = useState<string | null>(null)
    const [showDeleted, setShowDeleted] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [deletedConversations, setDeletedConversations] = useState<ChatConversationSummary[]>([])
    const [copiedSessionId, setCopiedSessionId] = useState(false)
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

    async function handleCopySessionId() {
        if (!identity?.sessionId) {
            return
        }

        try {
            await navigator.clipboard.writeText(identity.sessionId)
            setCopiedSessionId(true)
        } catch (error) {
            console.error('Failed to copy session id', error)
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

    useEffect(() => {
        if (!copiedSessionId) {
            return
        }

        const timeout = setTimeout(() => setCopiedSessionId(false), 600)
        return () => clearTimeout(timeout)
    }, [copiedSessionId])

    return (
        <aside
            className={clsx(
                `relative flex min-h-0 flex-col p-6 before:absolute
                before:content-[''] before:w-[2.6rem] before:h-[2.6rem]
                before:border-t-[0.7rem] before:border-r-[0.7rem] before:border-b-0
                before:border-(--color-border-default) before:border-l-0
                before:top-0 before:right-0 before:transition`,
                className
            )}
        >
            <NewChatLink text={text} />
            <PreviousChatsHeader
                text={text}
                showDeleted={showDeleted}
                isLoadingConversations={isLoadingConversations}
                visibleConversations={visibleConversations}
            />
            <PreviousChatsList
                text={text}
                showDeleted={showDeleted}
                visibleConversations={visibleConversations}
                id={id}
                sidebar={sidebar}
                restoringConversationId={restoringConversationId}
                router={router}
                setSidebar={setSidebar}
                handleMenuItemSidebar={handleMenuItemSidebar}
                handleShareConversation={handleShareConversation}
                handleDeleteConversation={handleDeleteConversation}
                handleRestoreConversation={handleRestoreConversation}
                getDeleteIconClassName={getDeleteIconClassName}
                getConversationClassName={getConversationClassName}
            />

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
                {!identity?.isLoggedIn && identity?.sessionId ? (
                    <button
                        type='button'
                        onClick={() => void handleCopySessionId()}
                        className='cursor-pointer rounded-lg bg-(--color-bg-surface) py-1.75 text-sm text-(--color-text-main) 1000px:hidden'
                    >
                        {copiedSessionId ? text.copied : text.copySessionId}
                    </button>
                ) : null}
                <button
                    type='button'
                    onClick={() => setShowDeleted(prev => !prev)}
                    className={`
                        cursor-pointer rounded-lg bg-(--color-bg-surface) py-1.75 text-sm 
                        text-(--color-text-main)
                    `}
                >
                    {showDeleted ? text.previousChats : text.deleted}
                </button>
            </div>
        </aside>
    )
}
