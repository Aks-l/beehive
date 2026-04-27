'use client'

import { SubmitEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import useLang from '@/hooks/useLang'
import no from '@text/search/no.json'
import en from '@text/search/en.json'
import { encodeSearchPayload, normalizeEngine } from '@utils/search'
import { setCookie } from 'utilbee'

function buildAnimationPath(token: string): string {
    const params = new URLSearchParams({
        s: token,
        play: '1'
    })
    return `/s?${params.toString()}`
}

export default function SearchPage({ preferredEngine }: { preferredEngine: EngineKey }) {
    const text = useLang(no, en)
    const router = useRouter()

    const [query, setQuery] = useState('')
    const [engine, setEngine] = useState<EngineKey>(preferredEngine)
    const [error, setError] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const [copied, setCopied] = useState(false)

    function toAbsoluteLink(path: string) {
        if (typeof window === 'undefined') {
            return path
        }

        return `${window.location.origin}${path}`
    }

    function buildLinkAndValidate() {
        const trimmedQuery = query.trim()
        if (!trimmedQuery) {
            setError(text.entry.errors.empty)
            return null
        }

        const token = encodeSearchPayload(trimmedQuery, engine)
        const path = buildAnimationPath(token)

        setGeneratedLink(toAbsoluteLink(path))
        setCopied(false)
        setError('')

        return {
            path,
            token
        }
    }

    async function onCreateAndCopyLink() {
        const built = buildLinkAndValidate()
        if (!built) {
            return
        }

        try {
            await navigator.clipboard.writeText(toAbsoluteLink(built.path))
            setCopied(true)
        } catch {
            setError(text.entry.errors.copy)
        }
    }

    function onOpenAnimation(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const built = buildLinkAndValidate()
        if (!built) {
            return
        }

        router.push(built.path)
    }

    return (
        <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
            <div className='page-section--normal flex min-h-[calc(100vh-var(--h-topbar)-2rem)]'>
                <section className='relative w-full overflow-hidden p-4 400px:p-6 800px:p-8'>
                    <header className='relative z-1'>
                        <h1 className='heading-1 my-0! p-0!'>{text.entry.title}</h1>
                        <p className='p-highlighted mb-0!'>{text.entry.subtitle}</p>
                    </header>

                    <form onSubmit={onOpenAnimation} className='relative z-1 mt-6'>
                        <label htmlFor='search-input' className='sr-only'>
                            {text.entry.queryLabel}
                        </label>
                        <div className='grid gap-3 700px:grid-cols-[1fr_14rem]'>
                            <input
                                id='search-input'
                                name='search'
                                type='text'
                                autoComplete='off'
                                spellCheck={false}
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value)
                                    setCopied(false)
                                }}
                                placeholder={text.entry.queryPlaceholder}
                                className='w-full rounded-(--border-radius)
                                    border border-(--color-border-default) bg-(--color-bg-surface-raised)
                                    px-4 py-3 text-base outline-none transition-all duration-200
                                    focus:border-(--color-primary)
                                    focus:shadow-[0_0_0_0.2rem_color-mix(in_oklab,var(--color-primary)_24%,transparent)]'
                            />
                            <label className='sr-only' htmlFor='search-engine'>
                                {text.entry.engineLabel}
                            </label>
                            <select
                                id='search-engine'
                                value={engine}
                                onChange={(event) => {
                                    const normalizedEngine = normalizeEngine(event.target.value)
                                    setEngine(normalizedEngine)
                                    setCookie('preferredEngine', normalizedEngine)
                                    setCopied(false)
                                }}
                                className='rounded-(--border-radius) border border-(--color-border-default)
                                    bg-(--color-bg-surface) px-4 py-3 text-base
                                    focus:border-(--color-primary) focus:outline-none'
                            >
                                <option value='brave'>{text.entry.engines.brave}</option>
                                <option value='google'>{text.entry.engines.google}</option>
                                <option value='duckduckgo'>{text.entry.engines.duckduckgo}</option>
                            </select>
                        </div>

                        <div className='mt-3 flex flex-wrap gap-2'>
                            <button
                                type='button'
                                onClick={() => void onCreateAndCopyLink()}
                                className='rounded-(--border-radius) bg-(--color-btn-primary-bg)
                                    px-4 py-2 font-medium text-(--color-btn-primary-text)
                                    transition-all duration-200 hover:brightness-95'
                            >
                                {copied ? text.entry.actions.copied : text.entry.actions.createAndCopy}
                            </button>
                        </div>

                        {generatedLink && (
                            <div
                                className='mt-4 rounded-(--border-radius)
                                    border border-(--color-border-default)
                                    bg-(--color-bg-surface) p-3'
                            >
                                <p className='text-[0.8rem] font-semibold uppercase tracking-[0.14em]'>
                                    {text.entry.linkLabel}
                                </p>
                                <p className='mt-1 break-all text-[0.92rem] text-(--color-text-regular)'>
                                    {generatedLink}
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className='mt-3 text-[0.95rem] text-red-500'>
                                {error}
                            </p>
                        )}
                    </form>
                </section>
            </div>
        </div>
    )
}
