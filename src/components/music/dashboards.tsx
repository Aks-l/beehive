'use client'

import { setCookie } from 'utilbee/utils'
import Link from 'next/link'
import no from '@text/music/no.json'
import en from '@text/music/en.json'

export default function Dashboards({lang}: {lang: Lang}) {
    const text = (lang === 'no' ? no : en)
    const style = 'flex items-center gap-4 p-4 rounded-lg bg-(--color-bg-surface) shadow-none w-full font-semibold'

    function handleClick() {
        setCookie('shouldReload', 'true')
    }

    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <Link href='/music/dashboard/today' onClick={handleClick} className={style}>{text.dashboard.today}</Link>
            <Link href='/music/dashboard/all' onClick={handleClick} className={style}>{text.dashboard.allTime}</Link>
            <Link href='/music/dashboard/current' onClick={handleClick} className={style}>{text.dashboard.currently}</Link>
        </div>
    )
}
