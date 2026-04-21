type FooterProps = {
    isConnected: boolean
    text: AIText
    chatSession: ChatSession | null
    isLoadingChat: boolean
}

export default function Footer({ isConnected, text, chatSession, isLoadingChat }: FooterProps) {
    return (
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
    )
}
