import TopBar from '@components/topbar/topBar'
import TopBarPwned from '@components/topbar/topBarPwned'
import Footer from '@components/footer/footer'
import type { ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import '@assets/fonts/style.css'
import '@assets/fonts/logfont/style.css'
import 'uibee/styles'
import './globals.css'
import clsx from '@utils/clsx'
import Alerts from '@components/alerts/alerts'
import { normalizeLang } from '@utils/lang'
export { default as metadata } from './metadata'
export { default as viewport } from './metadata'

export default async function layout({ children }: { children: ReactNode }) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'
    const lang = normalizeLang(Cookies.get('lang')?.value)
    const Headers = headers()
    const path = (await Headers).get('x-current-path') || ''
    const page = path.split('/').pop()
    const dashboard = path.includes('dashboard')
    const aiChat = path.startsWith('/ai/')
    const hideFooter = page === 'pwned' || path.includes('dashboard') || aiChat
    const pwnedHeaderClassName = 'fixed top-0 z-900 w-full bg-(--color-bg-topbar-fallback) '
        + 'supports-[backdrop-filter:blur(0px)]:bg-(--color-bg-topbar) '
        + 'supports-[backdrop-filter:blur(0px)]:backdrop-blur-[20px]'

    return (
        <html test-id='root' lang={lang === 'no' ? 'nb' : 'en'} className={theme}>
            <body
                className={clsx(
                    'min-h-screen w-full bg-(--color-bg-body)',
                    dashboard && 'max-h-screen overflow-hidden',
                    aiChat && 'h-dvh overflow-hidden'
                )}
            >
                {page !== 'pwned' ? (
                    <header className='fixed top-0 z-900 w-full'>
                        <TopBar onlyLogo={dashboard} theme={theme} />
                    </header>
                ) : (
                    page === 'pwned' && (
                        <header className={pwnedHeaderClassName}>
                            <TopBarPwned lang={lang} theme={theme} />
                        </header>
                    )
                )}
                <main
                    className={clsx(
                        'w-full mx-auto mt-(--h-topbar)',
                        aiChat
                            ? 'h-[calc(100dvh-var(--h-topbar))] min-h-0 overflow-hidden'
                            : 'min-h-[calc(100vh-var(--h-topbar))]'
                    )}
                >
                    {children}
                </main>
                {!hideFooter && (
                    <footer className='bg-(--color-bg-footer)'>
                        <Footer />
                    </footer>
                )}
                <Alerts />
            </body>
        </html>
    )
}
