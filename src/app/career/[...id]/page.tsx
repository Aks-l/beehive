import config from '@config'
import Article from '@components/article/article'
import Button from '@components/button/button'
import { getJob } from '@utils/api'
import no from '@text/jobadPage/no.json'
import en from '@text/jobadPage/en.json'
import { formatDeadlineDate } from '@utils/datetimeFormatter'
import ArrowOutward from '@components/svg/symbols/arrowOutward'
import Pin from '@components/svg/symbols/pin'
import HourglassBottom from '@components/svg/symbols/hourglassBottom'
import WorkHistory from '@components/svg/symbols/workHistory'
import Acute from '@components/svg/symbols/acute'
import Badge from '@components/svg/symbols/badge'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Alert from '@components/alert/alert'
import Wrench from '@components/svg/symbols/wrench'
import DefaultJobBanner from '@components/svg/defaultbanners/defaultJobBanner'
import { normalizeLang } from '@utils/lang'

function deadlineWarning(deadline: Date) {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const oneDay = 1000 * 60 * 60 * 24

    return diff < oneDay && diff > 0
}

export default async function JobadPage({ params }: PromisedPageProps) {
    const id = (await params).id
    const jobads = await getJob(Number(id))
    const jobad = typeof jobads === 'object' ? jobads : null
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en
    const temp_empty = lang === 'no' ? 'Oi! Her var det tomt... ' : 'Oh! Looks empty... '
    const jobadPageLayoutClass = 'grid items-start grid-cols-1 gap-y-6 '
        + '800px:grid-cols-[20rem_minmax(0,1fr)] 800px:gap-x-[5%] 800px:gap-y-8 800px:pt-12 800px:px-8 '
        + '800px:max-w-[calc(var(--w-page)+4rem)] 800px:mx-auto'

    return (
        <>
            {jobad && (
                <div className={jobadPageLayoutClass}>
                    <div
                        className='w-full py-8 px-4 overflow-hidden relative 450px:p-8
                            800px:p-0
                            800px:row-span-2
                            800px:before:content-[""] 800px:before:w-[2.6rem] 800px:before:h-[2.6rem]
                            800px:before:absolute 800px:before:border-[0.7rem]
                            800px:before:border-(--color-border-default)
                            800px:before:border-solid 800px:before:border-b-0 800px:before:border-l-0
                            800px:before:top-0 800px:before:right-0 800px:before:transition
                            800px:after:content-[""] 800px:after:w-[2.6rem] 800px:after:h-[2.6rem]
                            800px:after:absolute 800px:after:border-[0.7rem]
                            800px:after:border-(--color-border-default)
                            800px:after:border-solid 800px:after:border-t-0 800px:after:border-r-0
                            800px:after:bottom-0 800px:after:left-0 800px:after:transition'
                    >
                        <div className='flex h-full flex-col'>
                            <div className='flex flex-row flex-wrap gap-4 mb-8 800px:flex-col 800px:mr-[1.3rem]'>
                                <div
                                    className='relative block w-40 h-auto aspect-5/2 self-start rounded-(--border-radius)
                                        overflow-hidden 450px:w-48 800px:w-56'
                                >
                                    {jobad?.organization?.logo ? (
                                        <Image
                                            src={`${config.url.cdn}/img/organizations/${jobad.organization.logo}`}
                                            alt={jobad.organization.logo ?? 'Organization logo'}
                                            fill
                                            sizes='(min-width: 800px) 14rem, (min-width: 450px) 12rem, 10rem'
                                            className='object-contain object-center'
                                        />
                                    ) : (
                                        <DefaultJobBanner color='#545b5f' className='h-full w-full' transition={true} />
                                    )}
                                </div>
                                <div className='text-2xl my-auto leading-[1.4em] whitespace-pre-line wrap-break-word hyphens-auto'>
                                    {/* @ts-ignore */}
                                    {jobad.organization.link_homepage ? (
                                        <a
                                            className='flex flex-row items-center hover:underline'
                                            // @ts-ignore
                                            href={jobad.organization.link_homepage}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {/* @ts-ignore */}
                                            {lang === 'en' && jobad.organization.name_en
                                                ? jobad.organization.name_en
                                                : `${jobad.organization.name_no} `}
                                            <ArrowOutward className='w-[1.6rem] h-[1.6rem] fill-(--color-text-main)' />
                                        </a>
                                    ) : (
                                        <>
                                            {lang === 'en' && jobad.organization.name_en
                                                ? jobad.organization.name_en
                                                : jobad.organization.name_no}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-[min-content_auto] gap-4 mb-12'>
                                <div className='text-(--color-text-discreet) inline-flex items-start'>
                                    <HourglassBottom
                                        className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                    />
                                    {text.details.deadline}:
                                </div>
                                <div className='jobad-details_value'>
                                    {formatDeadlineDate(
                                        // @ts-ignore
                                        new Date(jobad.time_expire),
                                        lang,
                                    )}
                                    {/* @ts-ignore */}
                                    {deadlineWarning(new Date(jobad.time_expire)) && (
                                        <Acute
                                            className='w-fit pr-0 ml-2 text-center leading-6 fill-(--color-text-primary)'
                                        />
                                    )}
                                </div>
                                {/* @ts-ignore */}
                                {jobad.position_title_no && (
                                    <>
                                        <div className='text-(--color-text-discreet) inline-flex items-start'>
                                            <Badge
                                                className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                            />
                                            {text.details.position}:
                                        </div>
                                        <div className='jobad-details_value'>
                                            {/* @ts-ignore */}
                                            {lang == 'en' && jobad.position_title_en ? jobad.position_title_en : jobad.position_title_no}
                                        </div>
                                    </>
                                )}
                                <div className='text-(--color-text-discreet) inline-flex items-start'>
                                    <WorkHistory
                                        className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                    />
                                    {text.details.type}:
                                </div>
                                <div className='jobad-details_value'>
                                    {/* @ts-ignore */}
                                    {lang == 'en' ? jobad.job_type.name_en : jobad.job_type.name_no}
                                </div>
                                {/* @ts-ignore */}
                                {jobad.cities && jobad.cities.length > 0 && (
                                    <>
                                        <div
                                            className='flex-row text-(--color-text-discreet)
                                            inline-flex'
                                        >
                                            <Pin
                                                className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                            />
                                            {/* @ts-ignore */}
                                            {jobad.cities.length > 1 ? text.details.locations : text.details.location}:
                                        </div>
                                        <div className='jobad-details_value'>
                                            {/* @ts-ignore */}
                                            {jobad.cities.join(', ')}
                                        </div>
                                    </>
                                )}
                                {/* @ts-ignore */}
                                {jobad.skills && jobad.skills.length > 0 && (
                                    <>
                                        <div className='text-(--color-text-discreet) inline-flex items-start'>
                                            <Wrench
                                                className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                            />
                                            {text.details.skills}:
                                        </div>
                                        <div className='jobad-details_value'>
                                            {/* @ts-ignore */}
                                            {jobad.skills.join(', ')}
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* @ts-ignore */}
                            {jobad.application_url && (
                                // @ts-ignore
                                <Button
                                    trailingIcon={<ArrowOutward className='w-6 h-6 fill-white' />}
                                    // @ts-ignore
                                    href={jobad.application_url}
                                    className='w-full 400px:w-fit 450px:w-fit 800px:min-w-48 800px:mt-auto 800px:ml-auto'
                                >
                                    {text.details.applyButton}
                                </Button>
                            )}
                        </div>
                    </div>
                    {jobad.banner_image && (
                        <div
                            className='order-first relative min-w-0 w-full overflow-hidden rounded-(--border-radius)
                                aspect-10/4 max-h-72 800px:order-0 800px:max-h-60'
                        >
                            <Image
                                src={`${config.url.cdn}/img/jobs/${jobad.banner_image}`}
                                alt={jobad.banner_image}
                                fill={true}
                                sizes='(min-width: 800px) calc(min(73rem + 4rem, 100vw) - 20rem - 5%), 100vw'
                                className='object-cover object-center'
                            />
                        </div>
                    )}
                    <div
                        className='p-4 relative 450px:p-8 800px:min-w-0 800px:pt-0 800px:pr-10 800px:pb-4 800px:pl-0
                            800px:after:content-[""] 800px:after:w-[2.6rem] 800px:after:h-[2.6rem]
                            800px:after:absolute 800px:after:border-[0.7rem]
                            800px:after:border-(--color-border-default)
                            800px:after:border-solid 800px:after:border-b-0 800px:after:border-l-0
                            800px:after:top-0 800px:after:right-0 800px:after:transition
                            800px:before:content-[""] 800px:before:w-[2.6rem] 800px:before:h-[2.6rem]
                            800px:before:absolute 800px:before:border-[0.7rem]
                            800px:before:border-(--color-border-default)
                            800px:before:border-solid 800px:before:border-t-0 800px:before:border-l-0
                            800px:before:bottom-0 800px:before:right-0 800px:before:transition'
                    >
                        <Article
                            title={lang == 'en' && jobad.title_en ? jobad.title_en : jobad.title_no}
                            publishTime={new Date(jobad.time_publish)}
                            updateTime={new Date(jobad.updated_at)}
                            informational={false}
                            introduction={
                                lang == 'en' && jobad.description_short_en ? jobad.description_short_en : jobad.description_short_no
                            }
                            description={lang == 'en' && jobad.description_long_en ? jobad.description_long_en : jobad.description_long_no}
                        />
                    </div>
                </div>
            )}
            {!jobad && (
                <Alert variant='danger' className='page-section--normal mt-32 mx-auto max-w-160'>
                    {temp_empty}
                </Alert>
            )}
        </>
    )
}
