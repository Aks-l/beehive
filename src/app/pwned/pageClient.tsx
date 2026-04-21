'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import config from '@config'
import no from '@text/pwned/no.json'
import en from '@text/pwned/en.json'
import { useDarkMode } from 'uibee/hooks'

type PageClientProps = {
    pwnedNumber: number
    lang: Lang
}

type MemeProps = {
    text: string
    pwned: ({ text: string, image: string })[]
}

export default function PageClient({pwnedNumber, lang}: PageClientProps){
    const [time, setTime] = useState<number>(1)
    const isDark = useDarkMode()
    const memes = (lang === 'no' ? no : en) as MemeProps
    const seconds = time === 1
        ? lang === 'no'
            ? 'sekund'
            : 'second'
        : lang === 'no'
            ? 'sekunder'
            : 'seconds'

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const difference = Math.floor((Date.now() - startTime) / 1000)
            setTime(difference)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const meme = memes.pwned[pwnedNumber] || memes.pwned[0] || { text: 'Pwned!', image: '' }

    return (
        <div className='h-full min-h-0 w-full overflow-hidden grid grid-rows-[auto,1fr,auto] justify-items-center items-center'>
            <h1 className='text-xl font-semibold px-8 max-w-240 text-center'>
                {meme.text}
            </h1>
            <div className='relative max-h-100 m-8'>
                <Image
                    src={`${config.url.cdn}/img/pwned/${meme.image}`}
                    className='object-contain w-auto h-100'
                    alt='meme'
                    width={400}
                    height={400}
                />
            </div>
            <div className='flex gap-2 items-center px-8'>
                <p className='text-xl flex text-center'>
                    {memes.text.replace('{time}', `${String(time)} ${seconds}`)}
                </p>
                <Image
                    src={`${config.url.cdn}/img/login_shitty_thicc${isDark ? '_white' : ''}.png`}
                    className='object-contain w-6 h-6'
                    alt='meme'
                    width={40}
                    height={40}
                />
            </div>
        </div>
    )
}
