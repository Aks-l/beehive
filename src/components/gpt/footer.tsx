type FooterProps = {
    isConnected: boolean
    text: AIText
    chatSession: ChatSession | null
    isLoadingChat: boolean
}

export default function Footer({ isConnected, text, chatSession, isLoadingChat }: FooterProps) {
    return (
        <div className='p-2 w-full h-12'>
            <div className='bg-(--color-bg-surface) rounded-lg w-full h-full flex gap-2 justify-center items-center'>
                <div className='flex items-center gap-3 text-sm text-(--color-text-discreet)'>
                    <span
                        className={`h-2.5 w-2.5 rounded-full
                            ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                    {isConnected ? text.liveConnection : text.reconnecting}
                </div>
                <div className='w-px h-[70%] bg-(--color-bg-surface-raised)' />
                <p className='text-sm text-(--color-text-discreet)'>
                    {chatSession
                        ? `${text.agent}: ${chatSession.clientName}`
                        : isLoadingChat
                            ? text.loadingConversation
                            : text.notFound}
                </p>
            </div>
        </div>
    )
}
