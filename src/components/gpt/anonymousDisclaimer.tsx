import { Check, Copy, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { setCookie } from 'utilbee'

type AnonymousDisclaimerProps = {
    identity: AIIdentity
    conversations: ChatConversationSummary[]
    text: AIText
}

export default function AnonymousDisclaimer({ identity, conversations, text }: AnonymousDisclaimerProps) {
    const [copy, setCopy] = useState(false)
    const [dismissed, setDismissed] = useState(identity.hideTemporaryBanner)

    function handleCopy() {
        navigator.clipboard.writeText(identity.sessionId)
        setCopy(true)
    }

    useEffect(() => {
        if (copy) {
            const timeout = setTimeout(() => {
                setCopy(false)
            }, 600)

            return () => clearTimeout(timeout)
        }
    }, [copy])

    function handleDismiss() {
        setDismissed(true)
        setCookie('hideTemporaryAiBanner', 'true', 365)
    }

    if (identity.isLoggedIn || conversations.length === 0 || dismissed) {
        return null
    }

    return (
        <div className='px-5 pt-4 1000px:px-8'>
            <div
                className='relative mx-auto grid w-full max-w-5xl gap-3 rounded-lg border border-login-orange/50
                    bg-login-orange/10 p-3 text-sm text-red-100 in-[.light]:text-login-orange
                    1000px:grid-cols-[minmax(0,1fr)_auto] 1000px:items-center'
            >
                <div className='grid gap-2'>
                    <div className='leading-6'>
                        {text.temporaryBanner.split('{id}')[0]}
                    </div>
                    <div className='flex w-fit items-center gap-2 rounded border border-login-orange/20 bg-login-orange/10 px-2 py-1'>
                        <code className='min-w-0 break-all'>{identity.sessionId}</code>
                        <button
                            type='button'
                            className='cursor-pointer shrink-0'
                            onClick={handleCopy}
                        >
                            {copy
                                ? <Check className='h-4 w-4 stroke-login-orange' />
                                : <Copy className='h-4 w-4' />}
                        </button>
                    </div>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <a
                        href={`/api/auth/login?redirect=${encodeURIComponent('/ai')}`}
                        className='cursor-pointer rounded-lg px-3 py-1.5 underline! decoration-current decoration-1'
                    >
                        {text.loginToSave}
                    </a>
                </div>
                <button
                    type='button'
                    aria-label={text.dismissBanner}
                    onClick={handleDismiss}
                    className='absolute right-2 bottom-2 cursor-pointer
                        rounded-(--border-radius) p-1 text-current opacity-70
                        transition hover:opacity-100 1000px:top-1/2
                        1000px:right-3 1000px:bottom-auto 1000px:-translate-y-1/2'
                >
                    <X className='h-4 w-4 stroke-login-orange' />
                </button>
            </div>
        </div>
    )
}
