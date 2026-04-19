import { getCookie } from 'utilbee/utils'
import { useEffect, useState } from 'react'
import { normalizeLang } from '@utils/lang'


export default function useLang<T extends object>(no: T, en: T) {
    const [lang, setLang] = useState<Lang>('no')

    useEffect(() => {
        const currentLang = normalizeLang(getCookie('lang'))
        setLang(currentLang)

        function handleLanguageChange() {
            setLang(normalizeLang(getCookie('lang')))
        }

        window.addEventListener('language-change', handleLanguageChange)
        return () => window.removeEventListener('language-change', handleLanguageChange)
    }, [])

    return lang === 'en' ? en : no
}
