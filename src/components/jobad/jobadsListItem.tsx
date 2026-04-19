import config from '@config'
import Tags from '@components/tags/tags'
import Link from 'next/link'
import { isNew } from '@utils/datetimeFormatter'
import { formatDeadlineDate } from '@utils/datetimeFormatter'
import Image from 'next/image'
import Pin from '@components/svg/symbols/pin'
import WorkHistory from '@components/svg/symbols/workHistory'
import Apartment from '@components/svg/symbols/apartment'
import HourglassBottom from '@components/svg/symbols/hourglassBottom'
import { cookies } from 'next/headers'
import DefaultJobBanner from '@components/svg/defaultbanners/defaultJobBanner'
import clsx from '@utils/clsx'
import { normalizeLang } from '@utils/lang'

export default async function JobadsListItem({ jobad }: {jobad: GetJobProps}) {
    const lang = normalizeLang((await cookies()).get('lang')?.value)

    // eslint-disable-next-line
    function useTags(publishTime: any, highlight: any) {
        if (highlight) return true
        if (isNew(publishTime)) return true
        return false
    }

    const showTags = useTags(jobad.time_publish, jobad.highlight)

    const wrapperClassName = clsx(
        'z-50 grid w-full items-center gap-y-2 rounded-(--border-radius) bg-(--color-bg-body)',
        'p-4 transition-all duration-200 group-hover:bg-(--color-bg-surface)',
        'whitespace-pre-line hyphens-auto wrap-break-word',
        'grid-cols-1',
        '400px:grid-cols-[auto_1fr] 400px:gap-x-4 400px:p-3',
        '600px:p-4',
        '800px:gap-x-8 800px:gap-y-2 800px:p-4',
        showTags && '400px:grid-rows-[1.6rem_auto]'
    )

    const detailClassName = clsx(
        'flex flex-row text-[0.9rem] leading-[1.4em] text-(--color-text-regular)',
        '800px:text-[0.95rem]'
    )

    const iconClassName = 'h-6 w-6 fill-(--color-text-discreet) pr-[0.3rem] text-[1.3em] align-top'

    return (
        <Link href={`/career/${jobad.id}`}>
            <div
                className={clsx(
                    'group mx-auto mb-6 cursor-pointer rounded-[0.4rem] p-[0.13rem] transition-all duration-200',
                    '400px:max-w-full',
                    jobad.highlight && 'bg-(--gradient-highlight) hover:bg-(--gradient-highlight-hover)',
                    jobad.highlight && 'transition-[background] duration-200 400px:mb-4 1000px:mb-8'
                )}
            >
                <div className={wrapperClassName}
                >
                    {showTags &&
                        <div className='flex h-min gap-2 400px:col-span-2 800px:col-start-2 800px:col-end-3 800px:row-start-1'>
                            <Tags
                                highlight={jobad.highlight}
                                timePublish={new Date(jobad.time_publish)}
                                canceled={false}
                                full={false}
                                ongoing={false}
                            />
                        </div>
                    }
                    <div
                        className={clsx(
                            'relative flex aspect-5/2 h-20 w-50 items-center justify-center rounded-(--border-radius)',
                            'bg-(--color-border-default)',
                            '400px:row-start-2 800px:row-span-2 800px:row-start-1'
                        )}
                    >
                        {jobad.organization.logo ? (
                            <Image
                                className={clsx(
                                    'block h-full max-h-full w-full max-w-full rounded-(--border-radius)',
                                    'border-[0.15rem] border-(--color-border-default) object-inherit aspect-3/2',
                                    '400px:h-18 600px:h-28 800px:h-32'
                                )}
                                src={`${config.url.cdn}/img/organizations/${jobad.organization.logo}`}
                                alt={jobad.organization.logo}
                                fill={true}
                            />
                        ) : (
                            <DefaultJobBanner
                                color={'#545b5f'}
                                className={clsx(
                                    'block h-full max-h-full w-full max-w-full rounded-(--border-radius)',
                                    'border-[0.15rem] border-(--color-border-default) object-inherit aspect-3/2',
                                    '400px:h-18 600px:h-28 800px:h-32'
                                )}
                                transition={false}
                            />
                        )}
                    </div>
                    <div className='400px:row-start-2 800px:row-start-2'>
                        <div className='inline-block text-[1.2rem] leading-[1.4em] 600px:text-[1.3rem] 800px:text-[1.5rem]'>
                            {lang === 'en' && jobad.title_en ? jobad.title_en : jobad.title_no}
                        </div>
                        <ul
                            className={clsx(
                                'mt-2 flex list-none flex-wrap gap-x-4 gap-y-2',
                                '600px:gap-x-[1.2rem] 600px:gap-y-[0.2rem]',
                                '800px:gap-x-6 800px:gap-y-2'
                            )}
                        >
                            <li className={detailClassName}>
                                <HourglassBottom className={iconClassName}/>
                                {formatDeadlineDate(new Date(jobad.time_expire), lang)}
                            </li>
                            <li className={detailClassName}>
                                <Apartment className={iconClassName}/>
                                {lang === 'en' ? jobad.organization.name_en : jobad.organization.name_no}
                            </li>
                            {jobad.job_type &&
                                <li className={detailClassName}>
                                    <WorkHistory className={iconClassName}/>
                                    {lang === 'en' ? jobad.job_type.name_en : jobad.job_type.name_no}
                                </li>
                            }
                            {jobad.cities && jobad.cities.length > 0 &&
                                <li className={clsx(detailClassName, 'items-center')}>
                                    <Pin className={iconClassName} />
                                    {formatCities(jobad.cities)}
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function formatCities(cities: unknown[]) {
    const characterLimit = 30
    let counter = 0
    const arr = []

    for (let i = 0; i < cities.length; i++) {
        counter += (cities[i] as string).length + 2

        if (counter >= characterLimit) {
            return (
                <>
                    {arr.join(', ')},
                    <span
                        className={clsx(
                            'rounded-[1em] bg-(--color-checktag-bg) px-[0.3rem] py-[0.1rem] pr-[0.45rem]',
                            'text-[0.8em] text-(--color-checktag-text)'
                        )}
                    >
                        +{cities.length - i}
                    </span>
                </>
            )
        }
        arr.push(cities[i])
    }

    return (arr.join(', '))
}
