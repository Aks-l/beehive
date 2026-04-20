'use client'

import { Children, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { LanguageToggle, LogoSmall, ThemeToggle } from 'uibee/components'
import { LogOut, User } from 'lucide-react'
import Bubble from './bubble'

type BubbleContent = {
    condition: boolean
    href: string
    className: string
    text: string
    fill: string
    stroke: string
    x: string
    hide: boolean
    handleHide: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

type NavbarProps = {
    children: ReactNode
    bubble?: {
        lang?: BubbleContent
        theme?: BubbleContent
        login?: BubbleContent
    }
    className?: string
    disableLanguageToggle?: boolean
    disableThemeToggle?: boolean
    innerClassName?: string
    lang?: 'no' | 'en'
    loginPath: string
    logoutPath: string
    onlyLogo?: boolean
    profilePath?: string
    theme?: string
    token?: string | null
}

function hamburgerStyle(isOpen: boolean, isSecond?: boolean) {
    return `bg-login-50 h-0.5 absolute w-8 transition-all duration-[400ms] left-2 ${
        isOpen
            ? `top-6 ${isSecond ? 'rotate-45' : '-rotate-45'}`
            : isSecond ? 'top-7' : 'top-4'
    }`
}

export default function Navbar({
    children,
    bubble,
    className,
    disableLanguageToggle,
    disableThemeToggle,
    innerClassName,
    lang,
    loginPath,
    logoutPath,
    onlyLogo,
    profilePath,
    token
}: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className={`${isMobileMenuOpen ? 'bg-[#181818f0]' : 'bg-[#18181899]'} backdrop-blur-xl fixed top-0 z-900 w-full ${className}`}>
            <div className={`flex w-full max-w-6xl m-auto p-2 transition duration-500 800px:justify-between 800px:p-4 ${
                isMobileMenuOpen ? 'h-screen bg-login-900/20 800px:h-20' : ''} ${innerClassName}
            `}>
                <div className='block h-12 p-1 800px:p-0'>
                    <Link
                        href='/'
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <LogoSmall />
                    </Link>
                </div>

                {onlyLogo ? null : (
                    <>
                        <nav className='hidden 800px:flex 800px:justify-between 800px:items-center 800px:w-fill max-w-200'>
                            {children}
                        </nav>

                        <nav className='flex w-[calc(100vw-8rem)] justify-end h-12 800px:w-fit'>
                            <div className='grid gap-2'>
                                {!disableThemeToggle && <ThemeToggle />}
                                {bubble?.theme?.condition && <Bubble bubble={bubble.theme} />}
                            </div>
                            <div className='grid gap-2'>
                                {!disableLanguageToggle && <LanguageToggle language={lang} />}
                                {bubble?.lang?.condition && <Bubble bubble={bubble.lang} />}
                            </div>
                            <div className='grid gap-2'>
                                {loginPath && logoutPath && (
                                    <AuthButton
                                        profilePath={profilePath}
                                        token={token}
                                        loginPath={loginPath}
                                        logoutPath={logoutPath}
                                    />
                                )}
                                {bubble?.login?.condition && <Bubble bubble={bubble.login} />}
                            </div>
                        </nav>

                        <button
                            className='w-12 h-12 relative cursor-pointer bg-none border-none 800px:hidden'
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className={hamburgerStyle(isMobileMenuOpen)} />
                            <div className={hamburgerStyle(isMobileMenuOpen, true)} />
                        </button>

                        <nav
                            className={`fixed top-16 w-[calc(100%-2rem)] max-w-140 mx-auto left-0 right-0 800px:hidden
                                transition-all duration-500 ease-in-out overflow-hidden
                                ${isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {Children.map(children, (child, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-500 ease-out ${
                                        isMobileMenuOpen
                                            ? 'opacity-100 transform translate-y-0'
                                            : 'opacity-0 transform -translate-y-4'
                                    }`}
                                    style={{
                                        transitionDelay: isMobileMenuOpen ? `${index * 80}ms` : '0ms'
                                    }}
                                >
                                    {child}
                                </div>
                            ))}
                        </nav>
                    </>
                )}
            </div>
        </div>
    )
}

type AuthButtonProps = {
    profilePath?: string
    logoutPath: string
    loginPath: string
    token?: string | null
}

function AuthButton({ profilePath, logoutPath, loginPath, token }: AuthButtonProps) {
    return (
        <div className='rounded-[0.3rem] hover:bg-login-300/20 h-12 w-12'>
            {token ? (
                <>
                    {logoutPath && (
                        <Link
                            href={logoutPath}
                            prefetch={false}
                            onClick={(e) => {
                                e.preventDefault()
                                window.location.href = logoutPath
                            }}
                            className='grid items-center justify-center h-full w-full'
                        >
                            <LogOut size={24} />
                        </Link>
                    )}
                    {profilePath && (
                        <Link
                            href={profilePath}
                            className='grid items-center justify-center h-full w-full'
                        >
                            <User size={24} />
                        </Link>
                    )}
                </>
            ) : (
                <Link
                    href={loginPath}
                    prefetch={false}
                    className='grid items-center justify-center h-full w-full'
                >
                    <User size={24} />
                </Link>
            )}
        </div>
    )
}
