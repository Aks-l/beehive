import config from '@config'
import Tags from '@components/tags/tags'
import Link from 'next/link'
import Image from 'next/image'
import HourglassBottom from '@components/svg/symbols/hourglassBottom'
import { formatDeadlineDate } from '@utils/datetimeFormatter'
import { cookies } from 'next/headers'
import Pin from '@components/svg/symbols/pin'
import DefaultJobBanner from '@components/svg/defaultbanners/defaultJobBanner'
import clsx from '@utils/clsx'
import { normalizeLang } from '@utils/lang'

type JobadCardProps = {
    jobad: GetJobProps
    highlight?: boolean
    disableTags?: boolean
}

export default async function JobadCard({ jobad, highlight = true, disableTags = false }: JobadCardProps) {
    const lang = normalizeLang((await cookies()).get('lang')?.value)

    const highlightClass = highlight
        ? [
            'border-[0.13rem]',
            'border-transparent',
            '[background:linear-gradient(var(--color-bg-body),var(--color-bg-body))_padding-box,' +
                'var(--gradient-highlight)_border-box]',
            'hover:[background:linear-gradient(var(--color-bg-surface),var(--color-bg-surface))_padding-box,' +
                'var(--gradient-highlight-hover)_border-box]',
        ].join(' ')
        : 'hover:bg-(--color-bg-surface)'

    return (
        <Link href={`/career/${jobad.id}`}>
            <div
                className={clsx(
                    'mx-auto flex h-full w-full max-w-100 cursor-pointer flex-col rounded-(--border-radius)',
                    'p-4 transition-all duration-200 800px:p-[5%]',
                    highlightClass
                )}
            >
                <div>
                    <div
                        className={clsx(
                            'relative flex w-full items-center justify-center overflow-clip rounded-(--border-radius)',
                            'min-h-20 max-h-40 bg-(--color-border-default) aspect-10/4'
                        )}
                    >
                        {jobad.banner_image || jobad.organization.logo ? (
                            <Image
                                src={jobad.organization.logo
                                    ? `${config.url.cdn}/img/organizations/${jobad.organization.logo}`
                                    : `${config.url.cdn}/img/jobs/${jobad.banner_image}`}
                                alt={jobad.banner_image ?? 'Job banner image'}
                                fill={true}
                                className='block h-full w-full rounded-none border-none object-cover object-center'
                            />
                        ) : (
                            <DefaultJobBanner
                                color={'#545b5f'}
                                className='block h-full w-full rounded-none border-none object-cover object-center'
                                transition={false}
                            />
                        )}
                    </div>
                    <div>
                        <div
                            className={clsx(
                                'mt-4 inline-block whitespace-pre-line hyphens-auto wrap-break-word',
                                'text-[1.1rem] leading-[1.3em] 400px:text-[1.3rem] 800px:text-[1.4rem]'
                            )}
                        >
                            {lang === 'en' && jobad.title_en ? jobad.title_en : jobad.title_no}
                        </div>
                        <ul className='my-2 flex list-none flex-wrap gap-x-4'>
                            <li className='flex w-full text-[0.9rem] leading-[1.4em] text-(--color-text-regular) 800px:text-[0.95rem]'>
                                <HourglassBottom className='w-6 fill-(--color-text-regular) pr-[0.3rem] text-[1.3em] align-top'/>
                                {formatDeadlineDate(new Date(jobad.time_expire), lang)}
                            </li>
                            {jobad.cities && (
                                <li className='flex w-full text-[0.9rem] leading-[1.4em] text-(--color-text-regular) 800px:text-[0.95rem]'>
                                    <Pin className='w-6 fill-(--color-text-regular) pr-[0.3rem] text-[1.3em] align-top'/>
                                    {jobad.cities.join(' ')}
                                </li>
                            )}
                        </ul>
                        {!disableTags && (
                            <div className='mt-auto flex gap-2 pt-4'>
                                <Tags
                                    highlight={jobad.highlight}
                                    timePublish={new Date(jobad.time_publish)}
                                    canceled={false}
                                    full={false}
                                    ongoing={false}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
