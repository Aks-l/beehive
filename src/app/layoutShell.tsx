'use client'

import TopBar from '@components/topbar/topBar'
import TopBarPwned from '@components/topbar/topBarPwned'
import Footer from '@components/footer/footer'
import Alerts from '@components/alerts/alerts'
import clsx from '@utils/clsx'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

type LayoutShellProps = {
    children: ReactNode
    bubbleLogin: boolean
    lang: Lang
    theme: string
}

export default function LayoutShell({
    children,
    bubbleLogin,
    lang,
    theme,
}: LayoutShellProps) {
    const path = usePathname() || ''
    const page = path.split('/').pop()
    const dashboard = path.includes('dashboard')
    const aiChat = path.startsWith('/ai')
    const lockDocumentScroll = aiChat || page === 'pwned'
    const hideFooter = page === 'pwned' || dashboard || aiChat
    const pwnedHeaderClassName = 'fixed top-0 z-900 w-full bg-(--color-bg-topbar-fallback) '
        + 'supports-[backdrop-filter:blur(0px)]:bg-(--color-bg-topbar) '
        + 'supports-[backdrop-filter:blur(0px)]:backdrop-blur-[20px]'

    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        const previousHtmlOverflow = html.style.overflow
        const previousBodyOverflow = body.style.overflow
        const previousBodyHeight = body.style.height

        if (lockDocumentScroll) {
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
            body.style.height = '100dvh'
        } else {
            html.style.overflow = ''
            body.style.overflow = ''
            body.style.height = ''
        }

        return () => {
            html.style.overflow = previousHtmlOverflow
            body.style.overflow = previousBodyOverflow
            body.style.height = previousBodyHeight
        }
    }, [lockDocumentScroll])

    return (
        <>
            {page !== 'pwned' ? (
                <header className='fixed top-0 z-900 w-full'>
                    <TopBar onlyLogo={dashboard} bubbleLogin={bubbleLogin} theme={theme} />
                </header>
            ) : (
                <header className={pwnedHeaderClassName}>
                    <TopBarPwned lang={lang} theme={theme} />
                </header>
            )}
            <main
                className={clsx(
                    'w-full mx-auto mt-(--h-topbar)',
                    (dashboard || aiChat || page === 'pwned') && 'h-[calc(100dvh-var(--h-topbar))] min-h-0 overflow-hidden',
                    !dashboard && !aiChat && page !== 'pwned' && 'min-h-[calc(100vh-var(--h-topbar))]'
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
        </>
    )
}
