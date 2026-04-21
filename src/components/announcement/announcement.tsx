import MarkdownRender from '@components/markdownrender/markdownRender'
import AnnouncementDismiss from './announcementDismiss'
import { ArrowRight, Megaphone } from 'lucide-react'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

const announcementText: Record<Lang, {
    banner: string
    title: string
    body: string
    button: string
    closeLabel: string
}> = {
    no: {
        banner: 'Kunngjøring',
        title: 'Hei, kjære Norsk Tipping-krigere og fans!',
        body: `Login Linjeforening er nå registrert i Frivillighetsregisteret!

Det betyr at vi offisielt er en del av Grasrotandelen

Grasrotandelen gir deg muligheten til å bestemme hvem som skal få en del av
Norsk Tippings overskudd - helt uten ekstra kostnad for deg.

Vi oppfordrer alle våre medlemmer til å velge oss som sin grasrotmottaker.
Dette kan bidra til en bedre økonomi i foreningen, som igjen gir oss
muligheten til å arrangere enda flere og bedre aktiviteter (og ja - mer
pizza 🍕).`,
        button: 'Velg Login hos Norsk Tipping',
        closeLabel: 'Lukk kunngjoring'
    },
    en: {
        banner: 'Announcement',
        title: 'Hi, dear Norsk Tipping warriors and fans!',
        body: `Login Student Association is now registered in the Register of
Non-Profit Organizations!

This means we are officially part of Grasrotandelen

Grasrotandelen gives you the opportunity to decide who receives a share of
Norsk Tipping's profits - completely at no extra cost to you.

We encourage all our members to choose us as their grasrot recipient.
This can contribute to a stronger economy in the association, which in turn
gives us the opportunity to organize even more and better activities
(and yes - more pizza 🍕).`,
        button: 'Choose Login on Norsk Tipping',
        closeLabel: 'Close announcement'
    }
}

const recipientUrl = 'https://www.norsk-tipping.no/grasrotandelen/din-mottaker/811940372'
const dismissCookieName = 'dismissAnnouncementGrasrot'

export default async function Announcement() {
    const cookieStore = await cookies()
    const lang = normalizeLang(cookieStore.get('lang')?.value)
    const dismissed = cookieStore.get(dismissCookieName)?.value === 'true'

    if (dismissed) {
        return null
    }

    const text = announcementText[lang]

    return (
        <div className='page-container px-4 pt-8'>
            <section className='page-section--normal'>
                <AnnouncementDismiss cookieName={dismissCookieName} closeLabel={text.closeLabel}>
                    <div
                        className='rounded-(--border-radius-large) border border-(--color-border-default)
                            bg-(--color-bg-surface) px-4 py-5 pr-12 500px:px-6 500px:py-6'
                    >
                        <div className='grid gap-4'>
                            <div className='flex min-h-8 items-center pr-8'>
                                <div
                                    className='inline-flex w-fit items-center gap-2 rounded-full border
                                        border-(--color-border-default) py-1'
                                >
                                    <Megaphone className='h-3.5 w-3.5 stroke-(--color-primary)' aria-hidden='true' />
                                    <span className='text-xs font-semibold tracking-wide uppercase text-(--color-primary)'>
                                        {text.banner}
                                    </span>
                                </div>
                            </div>

                            <h3 className='text-(--color-text-main) text-[1.35rem] leading-tight font-semibold 500px:text-[1.6rem]'>
                                {text.title}
                            </h3>

                            <div className='text-left'>
                                <MarkdownRender MDstr={text.body} />
                            </div>

                            <div className='pt-1'>
                                <a
                                    className='inline-flex items-center gap-2 rounded-(--border-radius)
                                        bg-(--color-btn-primary-bg) px-4 py-2 text-sm font-semibold text-white
                                        transition-colors duration-150 hover:bg-(--color-btn-primary-bg-active)'
                                    href={recipientUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {text.button}
                                    <ArrowRight className='h-4 w-4' aria-hidden='true' />
                                </a>
                            </div>
                        </div>
                    </div>
                </AnnouncementDismiss>
            </section>
        </div>
    )
}
