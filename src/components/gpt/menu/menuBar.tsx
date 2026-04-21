import { Share2, Trash2 } from 'lucide-react'

type MenuBarProps = {
    text: AIText
    conversation: ChatConversationSummary
    handleShareConversation: (event: React.MouseEvent<Element, MouseEvent>, conversationId: string) => Promise<void>
    handleDeleteConversation: (event: React.MouseEvent<Element, MouseEvent>, conversationId: string) => Promise<void>
    getDeleteIconClassName: (conversationId: string) => 'pointer-events-none opacity-100' | 'cursor-pointer'
}

export default function MenuBar({
    text,
    conversation,
    handleShareConversation,
    handleDeleteConversation,
    getDeleteIconClassName
}: MenuBarProps) {
    return (
        <div className='absolute'>
            <div className={`
                    relative bg-grey-700/10 left-8 top-4 rounded-lg grid
                    text-sm p-2 min-w-40 outline outline-grey-700/30
                `}>
                <button
                    type='button'
                    aria-label={`${text.share}: ${conversation.title}`}
                    onClick={(event) => handleShareConversation(event, conversation.id)}
                    className={`
                        flex gap-1 items-center rounded p-1 opacity-0
                        transition group-hover:opacity-60 hover:opacity-100 
                        cursor-pointer
                    `}
                >
                    <Share2 className='h-4 w-4' />
                    <h1>{text.share}</h1>
                </button>
                <button
                    type='button'
                    aria-label={`${text.delete}: ${conversation.title}`}
                    onClick={(event) => handleDeleteConversation(event, conversation.id)}
                    className={`
                        rounded p-1 opacity-0 transition group-hover:opacity-60
                        hover:opacity-100 flex gap-1
                        ${getDeleteIconClassName(conversation.id)}
                    `}
                >
                    <Trash2 className='h-4 w-4' />
                    <h1>{text.delete}</h1>
                </button>
            </div>
        </div>
    )
}
