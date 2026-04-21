import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

type AnonymousDisclaimerProps = {
    identity: AIIdentity
    conversations: ChatConversationSummary[]
    text: AIText
}

export default function AnonymousDisclaimer({ identity, conversations, text }: AnonymousDisclaimerProps) {
    const [copy, setCopy] = useState(false)

    function handleCopy() {
        navigator.clipboard.writeText(identity.sessionId)
        setCopy(true)
    }

    useEffect(() => {
        if (copy) {
            setTimeout(() => {
                setCopy(false)
            }, 600)
        }
    }, [copy])

    if (identity.isLoggedIn || conversations.length === 0) {
        return null
    }

    return (
        <div
            className='rounded-lg border border-login-orange/50 mx-auto px-20
                bg-login-orange/10 p-3 text-sm text-red-100
                in-[.light]:text-login-orange flex items-center
                justify-between'
        >
            <div className='flex'>
                {text.temporaryBanner.split('{id}').map((part, i, arr) => (
                    <span className='flex items-center gap-1' key={i}>
                        {part}
                        {i < arr.length - 1 && (
                            <div className='flex gap-1 bg-login-orange/10 rounded p-1'>
                                <code>{identity.sessionId}</code>
                                <button
                                    type='button'
                                    className='cursor-pointer'
                                    onClick={handleCopy}
                                >
                                    {copy
                                        ? <Check className='h-4 w-4 stroke-login-orange' />
                                        : <Copy className='h-4 w-4' />}
                                </button>
                            </div>
                        )}
                    </span>
                ))}
            </div>
            <div className='flex flex-wrap gap-3'>
                <a
                    href={`/api/auth/login?redirect=${encodeURIComponent('/ai')}`}
                    className='cursor-pointer rounded-lg px-3 py-1.5 underline! decoration-current decoration-1'
                >
                    {text.loginToSave}
                </a>
            </div>
        </div>
    )
}
