import { cookies } from 'next/headers'
import { getSafeActivity } from '@utils/api'
import type { Metadata } from 'next'
import MusicClient from './pageClient'
import Intro from '@components/music/intro'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import Dashboards from '@components/music/dashboards'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function Music() {
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const data = await getSafeActivity()
    const text = (lang === 'no' ? no : en)

    return (
        <div className='page-container'>
            <div className='page-section--normal space-y-4'>
                <Intro text={text} />
                <MusicClient lang={lang} initialData={data} />
                <Dashboards lang={lang} />
            </div>
        </div>
    )
}
