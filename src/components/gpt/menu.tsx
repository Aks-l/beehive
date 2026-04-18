import { deleteAiConversation } from '@utils/ai'
import { MessageSquarePlus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type MenuProps = {
    text: AIText
    isLoadingConversations: boolean
    conversations: ChatConversationSummary[]
    loadConversations: () => void
    id: string
}

export default function Menu({
    text,
    isLoadingConversations,
    conversations,
    loadConversations,
    id
}: MenuProps) {
    const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)
    const router = useRouter()

    async function handleDeleteConversation(event: React.MouseEvent, conversationId: string) {
        event.stopPropagation()

        try {
            setDeletingConversationId(conversationId)
            await deleteAiConversation(conversationId)
            await loadConversations()

            if (conversationId === id) {
                router.push('/ai')
            }
        } catch (error) {
            console.error('Failed to delete conversation', error)
        } finally {
            setDeletingConversationId(null)
        }
    }

    function getConversationClassName(isActive: boolean) {
        return isActive
            ? 'border-(--color-primary) bg-(--color-bg-body)'
            : `border-transparent bg-transparent
                hover:border-(--color-border-default)
                hover:bg-(--color-bg-body)`
    }

    function getDeleteIconClassName(conversationId: string) {
        return deletingConversationId === conversationId
            ? 'pointer-events-none opacity-100'
            : 'cursor-pointer'
    }

    return (
        <aside
            className='flex min-h-0 flex-col border-b border-(--color-border-default)
                bg-(--color-bg-surface) px-4 py-4 1000px:border-r 1000px:border-b-0
                1000px:px-5'
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
            <div className='mt-5 flex items-center justify-between'>
                <h2 className='text-xs font-semibold tracking-[0.18em] text-(--color-text-discreet)'>
                    {text.previousChats}
                </h2>
                <span className='text-xs text-(--color-text-discreet)'>
                    {isLoadingConversations ? text.loading : conversations.length}
                </span>
            </div>

            {/* previous chats */}
            <div className='mt-4 flex-1 space-y-2 overflow-y-auto pr-1'>
                {conversations.map((conversation) => {
                    const isActive = conversation.id === id

                    return (
                        <button
                            key={conversation.id}
                            onClick={() => router.push(`/ai/${conversation.id}`)}
                            className={`group w-full rounded-lg p-3 text-left transition
                                ${getConversationClassName(isActive)}`}
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <p className='line-clamp-2 text-sm font-semibold text-(--color-text-main)'>
                                    {conversation.title}
                                </p>
                                <span className='flex shrink-0 items-center'>
                                    <Trash2
                                        onClick={(event) =>
                                            void handleDeleteConversation(event, conversation.id)}
                                        className={`h-4 w-4 opacity-0 transition group-hover:opacity-60
                                            hover:opacity-100 ${getDeleteIconClassName(conversation.id)}`}
                                    />
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}
