import DecoratedPicture from '@components/images/decoratedpicture/decoratedPicture'
import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import Link from 'next/link'
import config from '@config'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function SmallInfo() {
    const theme = (await cookies()).get('theme')?.value || 'dark'
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en
    const readMoreLinkClassName = 'mt-4 p-[.7rem_1rem_.7rem_0] text-[1.3rem] w-fit block link link--primary relative '
        + 'after:content-[""] after:absolute after:w-[0.8em] after:h-[0.8em] after:bottom-[0.4em] after:right-[0.4em] '
        + 'after:border-r-[0.2em] after:border-b-[0.2em] after:border-r-transparent after:border-b-transparent '
        + 'after:transition-all after:duration-200 hover:after:border-r-(--color-link-primary) '
        + 'hover:after:border-b-(--color-link-primary) hover:after:right-0 hover:after:bottom-0'

    function getSponsorPath() {
        if (theme === 'light') {
            return '/img/company/mnemonic-logo_dark-nopayoff-2021.svg'
        } else {
            return '/img/company/mnemonic-logo_light-nopayoff-2021.svg'
        }
    }

    return (
        <>
            <div
                test-id='small'
                className='max-w-300 w-full m-[3rem_auto] grid gap-x-16 p-4 grid-cols-1
                    800px:p-[8rem_2rem_0] 800px:grid-cols-7 800px:gap-16
                    1000px:gap-20 1200px:gap-24'
            >
                <div className='order-2 800px:col-span-3 w-full max-w-124 m-auto p-[1rem_0]'>
                    <h2 className='heading-2'>{text.whoAreWe.title}</h2>
                    <p className='p-regular'>{text.whoAreWe.body}</p>
                    <Link
                        className={readMoreLinkClassName}
                        href='about'
                    >
                        {text.readMore}
                    </Link>
                </div>
                <DecoratedPicture
                    imgUrl={`${config.url.cdn}/img/board/group/styret_2026.jpg`}
                    variant={4}
                    cornerSize={40}
                    width={150}
                    height={100}
                    cover={true}
                    className='order-1 800px:col-span-4 w-full max-w-124 m-auto 800px:max-w-160'
                />
            </div>

            <div className='max-w-300 w-full m-[3rem_auto] grid gap-x-16 p-4 grid-cols-1
                800px:p-[8rem_2rem_0] 800px:grid-cols-7 800px:gap-16
                1000px:gap-20 1200px:gap-24'
            >
                <div className='order-2 800px:order-1 800px:col-span-3 w-full max-w-124 m-auto p-[1rem_0]'>
                    <h2 className='heading-2'>{text.companiesInfo.title}</h2>
                    <p className='p-regular'>{text.companiesInfo.body}</p>
                    <Link
                        className={readMoreLinkClassName}
                        href='companies'
                    >
                        {text.readMore}
                    </Link>
                </div>
                <DecoratedPicture
                    imgUrl={`${config.url.cdn}/img/cyberdagen_preben.jpg`}
                    variant={2}
                    cornerSize={40}
                    width={150}
                    height={100}
                    cover={true}
                    className='order-1 800px:order-2 800px:col-span-4 w-full max-w-124 m-auto 800px:max-w-160'
                />
            </div>

            <div className='max-w-300 w-full m-[3rem_auto] grid gap-x-16 p-4 grid-cols-1
                800px:p-[8rem_2rem_0] 800px:grid-cols-7 800px:gap-16
                1000px:gap-20 1200px:gap-24'
            >
                <div className='order-2 800px:col-span-3 w-full max-w-124 m-auto p-[1rem_0]'>
                    <h2 className='heading-2'>{text.sponsor.title}</h2>
                    <p className='p-regular'>{text.sponsor.body}</p>
                    <a
                        className={readMoreLinkClassName}
                        href='https://www.mnemonic.io/'
                        target='_blank'
                    >
                        {text.readMore}
                    </a>
                </div>
                <DecoratedPicture
                    imgUrl={`${config.url.cdn}${getSponsorPath()}`}
                    variant={0}
                    cornerSize={0}
                    width={100}
                    height={30}
                    className={'order-1 800px:col-span-4 w-full max-w-124 m-auto 800px:max-w-160 transition-all duration-1000 ease-linear'}
                />
            </div>
        </>
    )
}
