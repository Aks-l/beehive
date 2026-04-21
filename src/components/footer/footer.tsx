import config from '@config'
import SocialLinks from './socialLinks'
import no from '@text/layout/no.json'
import en from '@text/layout/en.json'
import Image from 'next/image'
import Link from 'next/link'
import { normalizeLang } from '@utils/lang'
import { getCookie } from 'utilbee'

export default function Footer() {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const lang = normalizeLang(getCookie('lang'))
    const text = lang === 'no' ? no : en

    return (
        <div className='mt-40 mx-auto pt-16 px-4 pb-4
            md:max-w-[calc(var(--w-page)+4rem)] md:pt-20 md:px-12 md:pb-4
            md:grid md:grid-cols-[18rem_1fr] md:gap-x-12'
        >
            <div className='grid gap-16 max-w-60 w-full mx-auto md:row-span-2 md:max-w-72 md:gap-20'>
                <div>
                    <div className='block w-full'>
                        <Image
                            src={`${config.url.cdn}/img/logo/logo-tekst-white.svg`}
                            className='block w-full'
                            alt='Login - Linjeforeningen for IT'
                            width={800}
                            height={200}
                        />
                    </div>
                </div>
                <div>
                    <Link href='https://www.mnemonic.io/' target='_blank'>
                        <div className='block w-full'>
                            <Image
                                src={`${config.url.cdn}/img/company/mnemonic-logo_light-nopayoff-2021.svg`}
                                className='block w-full'
                                alt='mnemonic'
                                width={800}
                                height={200}
                            />
                        </div>
                    </Link>
                    <p className='text-center text-(--color-text-footer-discret) pt-8'>{text.footer.sponsor}</p>
                </div>
            </div>
            <div className='grid w-full max-w-60 mt-16 self-start
                sm:max-w-88 md:col-start-2 md:row-start-1 md:max-w-136
                md:justify-self-center md:mt-0'
            >
                <div>
                    <h4 className='pb-2 text-(--color-text-footer-discret) font-medium text-sm tracking-widest'>
                        {text.footer.sites.title}
                    </h4>
                    <div className='text-(--color-text-footer)'>
                        <Link className='block text-(--color-text-footer)' href='/policy'>{text.footer.sites.nav.policy}</Link>
                        <Link className='block text-(--color-text-footer)' href='/search'>{text.footer.sites.nav.search}</Link>
                        <Link className='block text-(--color-text-footer)' href='/pwned'>{text.footer.sites.nav.pwned}</Link>
                    </div>
                </div>
            </div>
            <div className='grid w-full max-w-60 mt-16 gap-8 self-start sm:grid-cols-2
                sm:max-w-88 sm:justify-items-end sm:justify-self-end
                md:col-start-2 md:row-start-1 md:max-w-136
                md:justify-self-end md:mt-0 md:gap-0'
            >
                <div className='sm:justify-self-center md:justify-self-end'>
                    <h4 className='text-(--color-text-footer-discret) font-medium text-sm tracking-widest pb-2'>
                        {text.footer.contact.address.header}
                    </h4>
                    <p className='text-(--color-text-footer)'>
                        {text.footer.contact.address.info1}
                        <br />
                        {text.footer.contact.address.info2}
                        <br />
                        {text.footer.contact.address.info3}
                    </p>
                </div>
                <div className='sm:justify-self-center md:justify-self-end'>
                    <h4 className='text-(--color-text-footer-discret) font-medium text-sm tracking-widest pb-2'>
                        {text.footer.contact.email}
                    </h4>
                    <p className='text-(--color-text-footer)'>
                        <a
                            className='text-(--color-text-footer) hover:underline'
                            href={`mailto:${config.url.mail}`}
                        >
                            {config.url.mail}
                        </a>
                    </p>
                </div>
            </div>
            <div className='md:col-start-2 md:row-start-2 md:justify-self-end'>
                <SocialLinks />
            </div>
            <div className='grid grid-cols-[auto_min-content] gap-8 mt-24 items-end md:col-span-2 md:row-start-3'>
                <p
                    className='text-(--color-text-footer-discret) text-xs'
                    dangerouslySetInnerHTML={{
                        __html: ` ${text.footer.copy1} ${currentYear} ${text.footer.copy2}`,
                    }}
                />
                {typeof config.version !== 'undefined' ? (
                    <Link
                        className='bg-[rgba(200,200,200,0.1)] px-[0.6rem] py-[0.4rem]
                            rounded-(--border-radius) text-white tracking-wide font-semibold'
                        target='_blank'
                        href={`${config.url.github}/beehive`}
                    >
                        v{config.version}
                    </Link>
                ) : null}
            </div>
        </div>
    )
}
