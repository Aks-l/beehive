'use client'

import { Navbar, NavDropdown, NavItem } from 'uibee/components'
import en from '@text/layout/en.json'
import no from '@text/layout/no.json'
import config from '@config'
import { Activity, BookMarked, BookOpen, Heart, Images, Music, Lock, Search, Sparkles } from 'lucide-react'
import Office from '@components/svg/symbols/office'
import { getCookie } from 'utilbee'
import { normalizeLang } from '@utils/lang'

type TopBarProps = {
    onlyLogo: boolean
    theme: string
}

export default function Topbar({ onlyLogo, theme }: TopBarProps) {
    const accessToken = getCookie('access_token') || null
    const lang = normalizeLang(getCookie('lang'))
    const text = lang === 'no' ? no : en
    const navbarClassName = 'bg-transparent! max-800px:[&.topbar--open]:h-screen '
        + 'max-800px:[&.topbar--open]:bg-(--color-bg-topbar-open) '
        + '800px:[&.topbar--open]:h-(--h-topbar)'

    return (
        <div className='relative'>
            <Navbar
                lang={lang}
                theme={theme}
                token={accessToken}
                loginPath={config.authPath.login}
                logoutPath={config.authPath.logout}
                onlyLogo={onlyLogo}
                className={navbarClassName}
            >
                <NavItem href='/events'>{text.nav.events}</NavItem>
                <NavItem href='/career'>{text.nav.jobad}</NavItem>
                <NavItem href='/companies'>{text.nav.companies}</NavItem>
                <NavDropdown title={text.nav.about} className='bg-(--color-bg-topbar-fallback)!'>
                    <NavItem href='/about'>
                        <div>
                            <i className='logfont-login pr-[0.7rem] text-[1.3rem] leading-6 align-middle ml-[0.1rem]' />
                            {text.nav.general}
                        </div>
                    </NavItem>
                    <NavItem href='/verv'>
                        <div className='flex flex-row items-center'>
                            <Heart className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.verv}
                        </div>
                    </NavItem>
                    <NavItem href='/fond'>
                        <div className='flex flex-row items-center'>
                            <Office className='size-6 fill-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.fondet}
                        </div>
                    </NavItem>
                    <NavItem href={config.url.wiki} external target='_blank'>
                        <div className='flex flex-row items-center'>
                            <BookOpen className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            Wiki
                        </div>
                    </NavItem>
                </NavDropdown>
                <NavDropdown title={text.nav.more} className='bg-(--color-bg-topbar-fallback)!'>
                    <NavItem href={config.url.exam} external target='_blank'>
                        <div className='flex flex-row items-center'>
                            <BookMarked className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.exam}
                        </div>
                    </NavItem>
                    <NavItem href='/albums'>
                        <div className='flex flex-row items-center'>
                            <Images className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.albums}
                        </div>
                    </NavItem>
                    <NavItem href='/music'>
                        <div className='flex flex-row items-center'>
                            <Music className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.music}
                        </div>
                    </NavItem>
                    <NavItem href='/status'>
                        <div className='flex flex-row items-center'>
                            <Activity className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.status}
                        </div>
                    </NavItem>
                    <NavItem href='/search'>
                        <div className='flex flex-row items-center'>
                            <Search className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.search}
                        </div>
                    </NavItem>
                    <NavItem href='/ai'>
                        <div className='flex flex-row items-center'>
                            <Sparkles className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                            {text.nav.ai}
                        </div>
                    </NavItem>
                    {accessToken && (
                        <NavItem href='/internal'>
                            <div className='flex flex-row items-center'>
                                <Lock className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.internal}
                            </div>
                        </NavItem>
                    )}
                </NavDropdown>
            </Navbar>
        </div>
    )
}
