'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useLang from '@/hooks/useLang'
import no from '@text/search/no.json'
import en from '@text/search/en.json'
import { buildEngineUrl, decodeSearchPayload } from '@utils/search'

type PlaybackStage = 'idle' | 'typing' | 'submitting' | 'redirecting'

export default function SearchAnimationPage({ preferredEngine }: { preferredEngine: EngineKey }) {
    const text = useLang(no, en)
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchParamsString = searchParams.toString()

    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
    const lastAutoTokenRef = useRef<string | null>(null)

    const [query, setQuery] = useState('')
    const [engine, setEngine] = useState<EngineKey>(preferredEngine)
    const [error, setError] = useState('')
    const [stage, setStage] = useState<PlaybackStage>('idle')
    const [typedQuery, setTypedQuery] = useState('')
    const queryLineRef = useRef<HTMLParagraphElement>(null)

    const isPlaying = stage !== 'idle'

    function clearTimers() {
        timersRef.current.forEach((timer) => clearTimeout(timer))
        timersRef.current = []
    }

    function schedule(callback: () => void, delay: number) {
        const timer = setTimeout(callback, delay)
        timersRef.current.push(timer)
    }

    function engineName(value: EngineKey, content: typeof no) {
        switch (value) {
            case 'duckduckgo': return content.entry.engines.duckduckgo
            case 'brave': return content.entry.engines.brave
            case 'google': return content.entry.engines.google
        }
    }

    function stageLabel(currentStage: PlaybackStage) {
        switch (currentStage) {
            case 'typing': return text.entry.playback.typing
            case 'submitting': return text.entry.playback.submitting
            case 'redirecting': return `${text.entry.playback.redirecting} ${engineName(engine, text)}`
            default: return text.entry.playback.idle
        }
    }

    function startPlayback(nextQuery: string, nextEngine: EngineKey) {
        clearTimers()
        setTypedQuery('')
        setStage('typing')

        const letters = Array.from(nextQuery)

        function writeLetter(index: number) {
            setTypedQuery(letters.slice(0, index).join(''))

            if (index < letters.length) {
                schedule(() => writeLetter(index + 1), 50)
                return
            }

            schedule(() => setStage('submitting'), 300)
            schedule(() => setStage('redirecting'), 950)
            schedule(() => {
                window.location.assign(buildEngineUrl(nextQuery, nextEngine))
            }, 1450)
        }

        schedule(() => writeLetter(1), 170)
    }

    useEffect(() => {
        return () => {
            clearTimers()
        }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString)
        const token = params.get('s')

        if (!token) {
            router.replace('/search')
            return
        }

        const payload = decodeSearchPayload(token)

        if (!payload || !payload.query.trim()) {
            setError(text.entry.errors.invalidLink)
            setStage('idle')
            return
        }

        const trimmedQuery = payload.query.trim()
        setQuery(trimmedQuery)
        setEngine(payload.engine)
        setError('')

        if (lastAutoTokenRef.current === token) {
            return
        }

        lastAutoTokenRef.current = token
        startPlayback(trimmedQuery, payload.engine)
    }, [searchParamsString])

    useEffect(() => {
        if (!queryLineRef.current) {
            return
        }

        queryLineRef.current.scrollLeft = queryLineRef.current.scrollWidth
    }, [typedQuery, query])

    return (
        <div className='h-full w-full'>
            <div className='flex h-full w-full items-stretch'>
                <section
                    className='relative w-full min-h-[calc(100vh-var(--h-topbar)-1.2rem)]
                        overflow-hidden rounded-(--border-radius-large)
                        border border-(--color-border-default)
                        p-4 400px:p-6 800px:p-10'
                >
                    <header className='relative z-1'>
                        <h1
                            className='mt-2 text-center text-[2.1rem] font-semibold
                                leading-[1.05] text-(--color-text-main)
                                600px:text-5xl 1000px:text-[3.5rem]'
                        >
                            {text.entry.playback.title}
                        </h1>
                        <p className='mx-auto mt-3 max-w-3xl text-center text-(--color-text-regular) 800px:text-[1.1rem]'>
                            {text.entry.description}
                        </p>
                    </header>

                    {error && (
                        <div
                            className='relative z-1 mx-auto mt-8 max-w-2xl rounded-(--border-radius)
                                border border-red-600 bg-red-100 p-4'
                        >
                            <p className='text-[0.95rem] text-red-500'>{error}</p>
                        </div>
                    )}

                    {!error && (
                        <div
                            role='status'
                            aria-live='polite'
                            className='relative z-1 mt-10 flex h-[calc(100%-10rem)] flex-col
                                justify-center gap-5'
                        >
                            <div
                                className='mx-auto w-full max-w-5xl rounded-full
                                    border border-(--color-border-default)
                                    bg-(--color-bg-surface) px-4 py-3 600px:px-8'
                            >
                                <div className='flex items-center gap-3'>
                                    <svg
                                        aria-hidden='true'
                                        viewBox='0 0 24 24'
                                        className='h-5 w-5 shrink-0 fill-(--color-text-discreet)'
                                    >
                                        <path
                                            d='M10 2a8 8 0 1 1-5.29 14l-2.85 2.85a1 1 0 0 1-1.41-1.41L3.3 14.6A8 8 0 0 1 10 2Z'
                                        />
                                        <path d='M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z' />
                                    </svg>
                                    <p
                                        ref={queryLineRef}
                                        title={isPlaying ? typedQuery : query}
                                        className='flex min-h-[1.8rem] min-w-0 flex-1 items-center
                                            overflow-x-auto whitespace-nowrap text-base'
                                    >
                                        <span className='inline-block'>{isPlaying ? typedQuery : query}</span>
                                        <span
                                            aria-hidden='true'
                                            className='ml-1 inline-block h-[1.1rem] w-[0.12rem] shrink-0
                                                bg-(--color-primary) animate-pulse'
                                        />
                                    </p>
                                    {engineName(engine, text) && <span
                                        className='rounded-full border border-(--color-border-default)
                                            bg-(--color-bg-body) px-3 py-1 text-xs font-semibold
                                            uppercase tracking-widest text-(--color-text-discreet) shrink-0'
                                    >
                                        {engineName(engine, text)}
                                    </span>}
                                </div>
                            </div>

                            <div className='mx-auto flex items-center gap-2'>
                                <span className='h-2 w-2 rounded-full bg-(--color-primary) animate-pulse' />
                                <p className='text-center text-base font-semibold text-(--color-text-main)'>
                                    {stageLabel(stage)}
                                </p>
                            </div>

                            <div className='mx-auto grid w-full max-w-5xl gap-3 1000px:grid-cols-2'>
                                <article
                                    className='rounded-(--border-radius) border border-(--color-border-default)
                                        bg-(--color-bg-surface) p-3'
                                >
                                    <div
                                        className='h-3 w-40 rounded-full bg-(--color-bg-surface-raised)
                                            animate-pulse'
                                    />
                                    <div
                                        className='mt-2 h-2 w-full rounded-full bg-(--color-bg-surface-raised)
                                            opacity-85 animate-pulse'
                                    />
                                    <div
                                        className='mt-2 h-2 w-5/6 rounded-full bg-(--color-bg-surface-raised)
                                            opacity-75 animate-pulse'
                                    />
                                </article>
                                <article
                                    className='rounded-(--border-radius) border border-(--color-border-default)
                                        bg-(--color-bg-surface) p-3'
                                >
                                    <div
                                        className='h-3 w-56 rounded-full bg-(--color-bg-surface-raised)
                                            animate-pulse'
                                    />
                                    <div
                                        className='mt-2 h-2 w-full rounded-full bg-(--color-bg-surface-raised)
                                            opacity-85 animate-pulse'
                                    />
                                    <div
                                        className='mt-2 h-2 w-4/6 rounded-full bg-(--color-bg-surface-raised)
                                            opacity-75 animate-pulse'
                                    />
                                </article>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
