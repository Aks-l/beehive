import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import '@assets/fonts/style.css'
import '@assets/fonts/logfont/style.css'
import 'uibee/styles'
import './globals.css'
import { normalizeLang } from '@utils/lang'
import LayoutShell from './layoutShell'
export { default as metadata } from './metadata'
export { default as viewport } from './metadata'

export default async function layout({ children }: { children: ReactNode }) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'
    const bubbleLogin = Cookies.get('bubbleLogin')?.value === 'true'
    const lang = normalizeLang(Cookies.get('lang')?.value)

    return (
        <html test-id='root' lang={lang === 'no' ? 'nb' : 'en'} className={theme}>
            <body className='min-h-screen w-full bg-(--color-bg-body)'>
                <LayoutShell bubbleLogin={bubbleLogin} lang={lang} theme={theme}>
                    {children}
                </LayoutShell>
            </body>
        </html>
    )
}
