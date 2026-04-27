import Contact from '@components/contact/contact'
import no from '@text/companies/no.json'
import en from '@text/companies/en.json'
import Flowsheet from '@components/svg/symbols/flowsheet'
import Megaphone from '@components/svg/symbols/megaphone'
import Wrench from '@components/svg/symbols/wrench'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function CompaniesPage() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <div className='page-container'>
            <div className='page-section--normal'>
                <h1 className='heading-1 heading-1--top-left-corner'>
                    {text.title}
                </h1>
                <section>
                    <p className='p-highlighted'>{text.intro}</p>
                </section>
                <div className='grid grid-cols-1 gap-y-4 max-w-180 mb-12
                    1000px:grid-cols-2 1000px:gap-x-16 1000px:gap-y-8
                    1000px:mb-20 1000px:max-w-none'
                >
                    <section>
                        <h2 className='heading-2 heading-2--icon'>
                            <Flowsheet className='w-12 h-12 fill-(--color-text-main) mr-[0.4em]' />
                            <span>{text.bedpres.title}</span>
                        </h2>
                        <p className='p-regular'>{text.bedpres.body}</p>
                        <p className='p-regular'>
                            {text.bedpres.footer1}
                            <a
                                className='link link--primary hover:underline'
                                href='mailto:bedpres@login.no'
                            >
                                bedpres@login.no
                            </a>
                            {text.bedpres.footer2}
                        </p>
                    </section>
                    <section>
                        <h2 className='heading-2 heading-2--icon'>
                            <i className='logfont-bedkom mr-[0.4em] text-[1.2em] leading-[inherit] align-top' />
                            {text.cyberdays.title}
                        </h2>
                        <p className='p-regular'>{text.cyberdays.body}</p>
                        <p className='p-regular'>
                            {text.cyberdays.footer1}
                            <a
                                className='link link--primary hover:underline'
                                href='mailto:cyberdagene@login.no'
                            >
                                cyberdagene@login.no
                            </a>
                            {text.cyberdays.footer2}
                        </p>
                    </section>
                    <section>
                        <h2 className='heading-2'>
                            <i className='logfont-ctfkom mr-[0.4em] text-[1.2em] leading-[inherit] align-top' />
                            {text.ctf.title}
                        </h2>
                        <p className='p-regular'>{text.ctf.body}</p>
                    </section>
                    <section>
                        <h2 className='heading-2 heading-2--icon'>
                            <Megaphone className='w-12 h-12 fill-(--color-text-main) mr-[0.4em]' />
                            <span>{text.profiling.title}</span>
                        </h2>
                        <p className='p-regular'>{text.profiling.body}</p>
                    </section>
                    <section>
                        <h2 className='heading-2 heading-2--icon'>
                            <Wrench className='w-12 h-12 fill-(--color-text-main) mr-[0.4em]' />
                            <span>{text.workshop.title}</span>
                        </h2>
                        <p className='p-regular'>{text.workshop.body}</p>
                    </section>
                </div>
                <Contact />
            </div>
        </div>
    )
}
