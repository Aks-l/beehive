import LoginLogo from '@components/svg/brandlogos/loginLogo'
import Button from '@components/button/button'
import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import Calendar from '@components/svg/symbols/calendar'
import School from '@components/svg/symbols/school'
import { cookies } from 'next/headers'
import clsx from '@utils/clsx'
import { normalizeLang } from '@utils/lang'

export default async function LandingPage() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <div
            test-id='hero'
            style={{ background: 'var(--gradient-hero-section-bg)' }}
            className={clsx(
                'h-screen w-full min-h-128 max-h-160',
                '600px:min-h-160 600px:max-h-180',
                '800px:[clip-path:ellipse(100%_95%_at_50%_0)]',
                '1000px:-mt-(--h-topbar) 1000px:max-h-200',
                '1200px:max-h-240'
            )}
        >
            <div
                className={clsx(
                    'relative top-1/2 mx-(--h-topbar) max-w-160 -translate-y-1/2',
                    '600px:mx-[10vw]',
                    '800px:mx-[5vw] 800px:max-w-400',
                    '1200px:mx-auto 1200px:max-w-280'
                )}
            >
                <div
                    className={clsx(
                        '800px:flex 800px:items-center 800px:justify-around',
                        '800px:gap-16 1000px:gap-20 1200px:gap-28'
                    )}
                >
                    <div className='mx-auto block w-full max-w-200'>
                        <LoginLogo />
                    </div>
                    <div
                        className={clsx(
                            'mt-16 w-full text-center 800px:m-auto 800px:w-fit 800px:text-left',
                            '1200px:text-[2.4rem] 1200px:leading-12'
                        )}
                    >
                        <span className='text-2xl leading-[2.2rem] 800px:text-[1.8rem] 1000px:text-[2.1rem]'>
                            {text.heroSection.welcome}
                        </span>
                        <br />
                        <span
                            style={{
                                background: 'var(--gradient-hero-section-text)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                            className={clsx(
                                'inline-block bg-clip-text text-[3.5rem]',
                                'pb-[0.08em] font-bold leading-[1.1em] text-transparent',
                                'selection:bg-(--color-primary) selection:text-white',
                                'selection:[-webkit-text-fill-color:white]',
                                '800px:text-[4.4rem] 1000px:text-[5rem]',
                                '1200px:text-[5.6rem]'
                            )}
                        >
                            login.no
                        </span>
                        <div
                            className={clsx(
                                'mx-auto mt-16 flex flex-wrap justify-center gap-4',
                                '800px:mt-8 800px:ml-0 800px:w-84 800px:justify-start'
                            )}
                        >
                            {/* @ts-ignore */}
                            <Button
                                href='events'
                                leadingIcon={<Calendar className='w-6 h-6 fill-white'/>}
                                variant='primary'
                                target=''
                            >
                                {text.heroSection.secondaryButton}
                            </Button>
                            {/* @ts-ignore */}
                            <Button
                                href='about'
                                leadingIcon={<School className='w-6 h-6 fill-(--color-text-main)'/>}
                                variant='ghost'
                                target=''
                            >
                                {text.heroSection.primaryButton}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
