'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import privacyNo from '@text/privacy/no.json'
import privacyEn from '@text/privacy/en.json'
import CurrentlyListening from '@components/music/currentlyListening'
import TopFiveThisX from '@components/music/topFiveThisX'
import MostPlayed from '@components/music/mostPlayed'
import TileInfo from '@components/music/tileInfo'
import MostX from '@components/music/mostx'
import { X } from 'lucide-react'
import { getCookie, setCookie } from 'utilbee/utils'

async function fetcher(url: string) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

function PrivacyDisclaimer({ lang }: { lang: Lang }) {
    const [privacyWarning, setPrivacyWarning] = useState(false)
    const text = lang === 'no' ? privacyNo : privacyEn

    function handleHide() {
        setPrivacyWarning(false)
    }

    function handleHideForever() {
        setPrivacyWarning(false)
        setCookie('neverWarnAboutPrivacyForMusic', 'true')
    }

    useEffect(() => {
        const doNotTrack = !!navigator.doNotTrack
        const gpc = (navigator as ExtendedNavigator).globalPrivacyControl
        const privacyBlocker = doNotTrack || gpc
        const alreadySuppressed = getCookie('neverWarnAboutPrivacyForMusic')

        if (alreadySuppressed) {
            return
        }

        if (privacyBlocker) {
            const timer = setTimeout(() => {
                setPrivacyWarning(false)
            }, 7900)

            setPrivacyWarning(true)
            return () => clearTimeout(timer)
        }
    }, [])

    if (!privacyWarning) {
        return null
    }

    return (
        <div className='fixed z-1000 top-24 right-4 bg-(--color-bg-surface) rounded-lg w-100 max-w-[90vw] p-2 grid gap-2'>
            <div className='flex w-full justify-between'>
                <h1 className='font-semibold'>{text.title}</h1>
                <X color='#fd8738' className='cursor-pointer' onClick={handleHide} />
            </div>
            <h1 className='text-xs'>{text.description}</h1>
            <h1
                onClick={handleHideForever}
                className='text-xs text-primary-500 cursor-pointer'
            >{text.noshow}</h1>
            <div className='h-1 bg-primary-500 w-0 mb-1 rounded-lg animate-[slide_8s_linear_forwards]' />
        </div>
    )
}

export default function Music({ initialData, lang }: { initialData: Music, lang: Lang }) {
    const text = (lang === 'no' ? no : en)
    const { data }: { data: Music } = useSWR('/api/music', fetcher, {
        refreshInterval: 5000,
        fallbackData: initialData,
    })

    return (
        <section className='flex flex-col justify-center items-center gap-4'>
            <PrivacyDisclaimer lang={lang} />
            <TileInfo data={data} text={text} />
            <MostPlayed
                lang={lang}
                mostPlayedAlbums={data.mostPlayedAlbums}
                mostPlayedArtists={data.mostPlayedArtists}
                mostPlayedSongs={data.mostPlayedSongs}
                mostPlayedEpisodes={data.mostPlayedEpisodes}
                mostActiveUsers={data.mostActiveUsers}
                mostSkippingUsers={data.mostSkippingUsers}
                currentlyListening={data.currentlyListening}
                activity={data.mostPlayedSongsPerDay}
            />
            <CurrentlyListening songs={data.currentlyListening} lang={lang} />
            <MostX
                lang={lang}
                mostLikedAlbums={data.mostLikedAlbums}
                mostLikedArtists={data.mostLikedArtists}
                mostLikedEpisodes={data.mostLikedEpisodes}
                mostLikedSongs={data.mostLikedSongs}
                mostSkippedAlbums={data.mostSkippedAlbums}
                mostSkippedArtists={data.mostSkippedArtists}
                mostSkippedSongs={data.mostSkippedSongs}
                mostSkippedEpisodes={data.mostSkippedEpisodes}
                mostInspiredEpisodes={data.mostInspiredEpisodes}
                mostInspiredSongs={data.mostInspiredSongs}
            />
            <TopFiveThisX lang={lang} data={data} />
        </section>
    )
}
