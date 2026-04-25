'use client'

import { useEffect, useState } from 'react'
import Language from '@components/svg/symbols/language'
import { getCookie, setCookie } from 'utilbee/utils'
import { useRouter } from 'next/navigation'
import clsx from '@utils/clsx'
import { normalizeLang } from '@utils/lang'

export let language = 'no'

type LangToggleProps = {
    serverLang: Lang
}

export default function LangToggle({serverLang}: LangToggleProps) {
    const [lang, setLang] = useState<'no' | 'en'>(serverLang)
    const [jump, setJump] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setLang(normalizeLang(getCookie('lang')))
    }, [])

    function handleClick() {
        const newLang = lang === 'no' ? 'en' : 'no'
        setCookie('lang', newLang)
        setLang(newLang)
        language = newLang
        setJump(true)
        setTimeout(() => setJump(false), 400)
        window.dispatchEvent(new Event('language-change'))
        router.refresh()
    }

    return(
        <button
            value={lang}
            onClick={handleClick}
            className={clsx(
                'flex w-[4.3rem] cursor-pointer flex-row items-center justify-center gap-1',
                'rounded-(--border-radius) border-none bg-transparent p-2 text-base',
                'leading-8 text-(--color-text-main) hover:bg-[#6464641a]',
                'in-[.topbar--open]:text-white'
            )}
        >
            <i className={clsx('mt-[-0.1rem] text-[1.4rem] leading-8', jump && 'animate-[lang-jump_0.4s_1]')}>
                <Language className='h-[1.4rem] w-[1.4rem] fill-(--color-text-main) in-[.topbar--open]:fill-white'/>
            </i>
            {' ' + lang}
        </button>
    )
}
