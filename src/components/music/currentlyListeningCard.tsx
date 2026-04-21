'use client'

import { useEffect, useState, useRef } from 'react'
import Marquee from './marquee'
import config from '@config'
import ImageWithPlayer from './imageWithPlayer'
import Link from 'next/link'
import { useVisibility } from 'uibee/hooks'
import Loader from '@components/loader/loader'

type InnerCurrentlyListeningCardProps = {
    song: CurrentlyListening
    progressPercent: number
    progressMs: number
    durationMs: number
    shouldRenderPlayer?: boolean
    done: boolean
}

export default function CurrentlyListeningCard({ song }: { song: CurrentlyListening }) {
    const startMs = Date.parse(song.start)
    const endMs = Date.parse(song.end)
    const durationMs = endMs - startMs
    const [progressMs, setProgressMs] = useState(0)
    const [shouldHide, setShouldHide] = useState(false)
    const [shouldRenderPlayer, setShouldRenderPlayer] = useState(false)
    const { ref } = useVisibility<HTMLAnchorElement>(() => setShouldRenderPlayer(true))
    const [done, setDone] = useState(false)
    const progressPercent = durationMs > 0 ? (progressMs / durationMs) * 100 : 0
    const animationRef = useRef<number>(0)

    useEffect(() => {
        if (durationMs <= 0) {
            return
        }

        function updateProgress() {
            const now = Date.now()
            const elapsed = now - startMs
            setProgressMs(Math.max(0, Math.min(elapsed, durationMs)))
            animationRef.current = requestAnimationFrame(updateProgress)
        }

        animationRef.current = requestAnimationFrame(updateProgress)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [song.id, startMs, durationMs])

    useEffect(() => {
        if (progressPercent === 100) {
            setDone(true)

            setTimeout(() => {
                setShouldHide(true)
            }, 30000)
        }
    }, [progressPercent])

    if (!done && progressPercent === 100) {
        return
    } else if (done && progressPercent < 100) {
        return
    } else if (shouldHide) {
        return
    }

    const style = `flex items-center gap-4 px-2 py-10 md:px-2 rounded-lg
        ${done ? 'bg-[var(--color-text-disabled)]/10' : 'bg-[var(--color-text-disabled)]/30'}
        shadow-none w-full
        ${song.song_id && 'transform transition hover:scale-[1.015] hover:z-20'}
        min-h-[90px] h-[90px] max-h-[90px]`
    const spotifyUrl = song.type === 'episode'
        ? `${config.url.spotifyEpisode}/${song.song_id}?utm_source=login`
        : `${config.url.spotify}${song.song_id}?utm_source=login`

    function handleMouseEnter() {
        setShouldRenderPlayer(true)
    }

    function handleMouseLeave() {
        setShouldRenderPlayer(false)
    }

    if (!song.song_id) {
        return (
            <div className={style}>
                <InnerCurrentlyListeningCard
                    done={done}
                    song={song}
                    durationMs={durationMs}
                    progressMs={progressMs}
                    progressPercent={progressPercent}
                />
            </div>
        )
    }

    return (
        <Link
            href={spotifyUrl}
            target='_blank'
            className={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={ref}
        >
            <InnerCurrentlyListeningCard
                done={done}
                song={song}
                durationMs={durationMs}
                progressMs={progressMs}
                progressPercent={progressPercent}
                shouldRenderPlayer={shouldRenderPlayer}
            />
        </Link>
    )
}

function InnerCurrentlyListeningCard({
    done,
    song,
    progressPercent,
    progressMs,
    durationMs,
    shouldRenderPlayer
}: InnerCurrentlyListeningCardProps) {
    const innerTextStyle = `text-xs ${done
        ? 'text-(--color-text-discreet)/50'
        : 'text-(--color-text-discreet)'}`
    return (
        <>
            <ImageWithPlayer
                song={{ ...song, media_type: song.type }}
                shouldRenderPlayer={shouldRenderPlayer}
            />
            <div className='flex flex-col flex-1 min-w-0 relative'>
                {done && (
                    <Loader
                        radius={20}
                        className='absolute -top-3 -right-3.5 h-12 w-12'
                        stroke='#0a0a0a50'
                    />
                )}
                <div className='flex justify-between items-center'>
                    <Marquee
                        text={song.name}
                        className='truncate'
                        innerClassName={`font-medium ${done
                            ? 'text-(--color-text-main)/50'
                            : 'text-(--color-text-main)'}`}
                    />
                </div>
                {song.artist === 'Unknown' ? <>
                    <Marquee text={song.album ?? ''} className='truncate' innerClassName={innerTextStyle} />
                    <Marquee text={song.artist} className='truncate' innerClassName={innerTextStyle} />
                </> : <>
                    <Marquee text={song.artist} className='truncate' innerClassName={innerTextStyle} />
                    <Marquee text={song.album ?? ''} className='truncate' innerClassName={innerTextStyle} />
                </>}
                <div className='mt-2 flex items-center w-full gap-2'>
                    <span className={`text-xs ${done
                        ? 'text-(--color-text-discreet)/50'
                        : 'text-(--color-text-discreet)'} min-w-10 text-right`}
                    >
                        {msToMinSec(progressMs)}
                    </span>
                    <div className='h-1.5 flex-1 bg-(--color-progressbar-unfilled)/20 rounded-full overflow-hidden relative'>
                        <div
                            className={`h-full ${done
                                ? 'bg-(--color-progressbar)/20'
                                : 'bg-(--color-progressbar)'} transition-all duration-1000 ease-linear`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className={`text-xs ${done
                        ? 'text-(--color-text-discreet)/50'
                        : 'text-(--color-text-discreet)'} min-w-10 text-left`}
                    >
                        {msToMinSec(durationMs)}
                    </span>
                </div>
            </div>
        </>
    )
}

function msToMinSec(ms: number) {
    if (!isFinite(ms) || ms < 0) {
        return '0:00'
    }

    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    return `${min}:${sec.toString().padStart(2, '0')}`
}
