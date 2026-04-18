import { Dispatch, SetStateAction } from 'react'

type UnavailableBannerProps = {
    showUnavailableBanner: boolean
    chatSession: ChatSession | null
    text: AIText
    selectedClient: string
    setSelectedClient: Dispatch<SetStateAction<string>>
    clients: GPT_Client[]
    isSwitching: boolean
    handleSwitchClient: () => void
}

export default function UnavailableBanner({
    showUnavailableBanner,
    chatSession,
    text,
    selectedClient,
    setSelectedClient,
    clients,
    isSwitching,
    handleSwitchClient
}: UnavailableBannerProps) {
    if (!showUnavailableBanner) {
        return
    }

    return (
        <div className='border-b border-(--color-border-default) px-5 py-4 1000px:px-8'>
            <div
                className='flex flex-col gap-3 rounded-(--border-radius-large)
                    border border-(--color-border-default) bg-(--color-bg-surface)
                    px-4 py-3 lg:flex-row
                    lg:items-center lg:justify-between'
            >
                <div>
                    <p className='font-semibold text-(--color-text-main)'>
                        {chatSession?.clientName} {text.modelUnavailable}
                    </p>
                    <p className='mt-1 text-sm text-(--color-text-discreet)'>
                        {text.handoffDescription}
                    </p>
                </div>

                <div className='flex flex-col gap-2 sm:flex-row'>
                    <select
                        value={selectedClient}
                        onChange={(event) => setSelectedClient(event.target.value)}
                        className='rounded-(--border-radius) border border-(--color-border-default)
                            bg-(--color-bg-main) px-3 py-2 text-sm
                            text-(--color-text-main) outline-none'
                    >
                        {clients.map((client) => (
                            <option key={client.name} value={client.name}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type='button'
                        onClick={handleSwitchClient}
                        disabled={!selectedClient || isSwitching || !clients.length}
                        className='rounded-(--border-radius) bg-(--color-primary) px-4 py-2
                            text-sm font-semibold text-white
                            disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isSwitching ? text.switching : text.continueOnAnotherModel}
                    </button>
                </div>
            </div>
        </div>
    )
}
