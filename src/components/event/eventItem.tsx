import DateTile from '@components/datetile/dateTile'
import Tags from '@components/tags/tags'
import DefaultEventBanner from '@svg/defaultbanners/defaultEventBanner'
import DefaultCtfBanner from '@svg/defaultbanners/defaultCtfBanner'
import DefaultTekkomBanner from '@svg/defaultbanners/defaultTekkomBanner'
import DefaultBedpresBanner from '@svg/defaultbanners/defaultBedpresBanner'
import DefaultSocialBanner from '@svg/defaultbanners/defaultSocialBanner'
import config from '@config'
import Link from 'next/link'
import Pin from '@components/svg/symbols/pin'
import Schedule from '@components/svg/symbols/schedule'
import { isNew } from '@utils/datetimeFormatter'
import { formatEventStartDate, isOngoing } from '@utils/datetimeFormatter'
import clsx from '@utils/clsx'
import Image from 'next/image'
import { cookies } from 'next/headers'

type EventListItemProps = {
    event: GetEventProps
    highlight: boolean
    disableTags?: boolean
    variant: string
}

export default async function EventListItem({ event, highlight = true, disableTags = false, variant='list-item' }: EventListItemProps) {
    const storedLang = (await cookies()).get('lang')?.value
    const lang: Lang = (storedLang?.includes('en') ? 'en' : 'no')
    const isCard = variant === 'card'
    const eventDetailIconClass =
        'pr-[0.3rem] text-[1.3em] align-top text-(--color-text-regular)'
    const itemClassName = clsx(
        'group p-0.5 cursor-pointer rounded-[0.4rem] mx-auto list-none transition-[background] duration-200',
        highlight && '[background:var(--gradient-highlight)] hover:[background:var(--gradient-highlight-hover)]',
        isCard ? 'w-full max-w-[30rem] h-full' : (highlight ? 'my-4' : 'my-[0.2rem]')
    )
    const wrapperClassName = clsx(
        'z-2 rounded-(--border-radius) bg-(--color-bg-body) transition-colors duration-200 group-hover:bg-(--color-bg-surface)',
        isCard
            ? 'p-4 h-full flex flex-col 400px:p-[5%]'
            : 'grid grid-cols-[min-content_auto_min-content] w-full p-2 600px:p-4'
    )
    const pictureBaseClassName = 'relative overflow-hidden aspect-5/2 bg-[rgba(128,128,128,0.05)]'
    const cardPictureClassName = clsx(pictureBaseClassName, 'rounded-(--border-radius)')
    const listPictureClassName = clsx(
        pictureBaseClassName,
        'hidden 600px:block 600px:max-h-20 600px:w-[12.5rem] 600px:h-full 600px:rounded-[0.2rem]'
    )
    const infoClassName = clsx(
        'grow flex flex-col whitespace-pre-line wrap-break-word [-ms-word-break:break-word]',
        '[-ms-hyphens:auto] [-moz-hyphens:auto] [-webkit-hyphens:auto] hyphens-auto',
        isCard ? 'mt-[0.8rem]' : 'min-w-40 my-auto pl-3 600px:px-4'
    )
    const nameClassName = clsx(
        'font-normal',
        isCard
            ? 'text-[1.1rem] leading-[1.3em] 350px:text-[1.2rem] 400px:text-[1.4rem]'
            : 'm-0 text-[1.1rem] leading-[1.4em] 600px:text-[1.2rem] 700px:text-[1.3rem]'
    )
    const detailsClassName = clsx(
        'list-none grow flex flex-wrap text-[#e6e6e6]',
        isCard
            ? 'mt-2 gap-y-[0.1rem] gap-x-2 350px:gap-x-4 400px:gap-x-[1.2rem]'
            : 'mt-[0.2rem] gap-y-[0.1rem] gap-x-2 600px:gap-y-[0.2rem] 600px:gap-x-4 700px:gap-y-2 700px:gap-x-[1.2rem]'
    )
    const tagsClassName = clsx('flex gap-2', isCard ? 'mt-4' : 'mt-2 flex-wrap 700px:mt-[0.7rem]')
    const dateOverlayClassName = 'absolute top-[0.4rem] left-[0.4rem] z-2'
    const bannerImageClassName = isCard
        ? 'block w-full h-full object-cover aspect-5/2 rounded-(--border-radius)'
        : 'object-cover hidden 600px:block 600px:max-h-20 600px:w-[12.5rem] 600px:h-full 600px:rounded-[0.2rem]'

    // eslint-disable-next-line
    function useTags(publishTime: any, highlight: any, canceled: boolean, full: boolean, ongoing: boolean) {
        if (disableTags) return false
        if (highlight) return true
        if (isNew(publishTime)) return true
        if (canceled) return true
        if (full) return true
        if (ongoing) return true
        return false
    }

    const startDate = new Date(event.time_start)
    const endDate = new Date(event.time_end)

    return (
        <Link href={`/events/${event.id}`}>
            <div className={itemClassName}>
                <div className={wrapperClassName}>
                    {!isCard ? (
                        <DateTile
                            startDate={new Date(event.time_start)}
                            endDate={new Date(event.time_end)}
                            color={event.category.color}
                            day={event.category.name_no.toLowerCase() === 'fadderuka' ? true : false}
                        />
                    ) : (
                        <div className={cardPictureClassName}>
                            <div className={dateOverlayClassName}>
                                <DateTile
                                    startDate={new Date(event.time_start)}
                                    endDate={new Date(event.time_end)}
                                    color={event.category.color}
                                    opacity={0.5}
                                    varient='overlay'
                                    useDayText={event.category.name_no.toLowerCase() === 'fadderuka' ? true : false}
                                />
                            </div>
                            {event.image_small ? (
                                <Image
                                    src={config.url.cdn + '/img/events/' + event.image_small}
                                    alt={event.image_small}
                                    fill={true}
                                    sizes='(min-width: 1000px) 22rem, (min-width: 800px) 50vw, 100vw'
                                    className={bannerImageClassName}
                                />
                            ) : (
                                getDefaultBanner(event.category.name_no, event.category.color, bannerImageClassName)
                            )}
                        </div>
                    )}
                    <div className={infoClassName}>
                        <div className={nameClassName}>{lang === 'en' && event.name_en ? event.name_en : event.name_no}</div>
                        <ul className={detailsClassName}>
                            {(event.time_type.toLowerCase() != 'whole_day') &&
                                <li className='flex text-[0.9rem]'>
                                    <Schedule
                                        className={`h-5.5 w-5.5 fill-(--color-text-main) ${eventDetailIconClass}`}
                                    />
                                    {event.time_type.toLowerCase() != 'to_be_determined' ?
                                        formatEventStartDate(new Date(event.time_start), lang)
                                        :
                                        'TBD'
                                    }
                                </li>
                            }
                            {event.location && (
                                <li className='flex text-[0.9rem]'>
                                    <Pin
                                        className={`h-6 w-6 fill-(--color-text-main) ${eventDetailIconClass}`}
                                    />
                                    {lang === 'en' ? event.location.name_en : event.location.name_no}
                                </li>
                            )}
                        </ul>
                        {useTags(event.time_publish, event.highlight, event.canceled, event.is_full, isOngoing(startDate, endDate)) &&
                            <div className={tagsClassName}>
                                <Tags
                                    highlight={event.highlight}
                                    timePublish={new Date(event.time_publish)}
                                    canceled={event.canceled}
                                    full={event.is_full}
                                    ongoing={isOngoing(startDate, endDate)}
                                />
                            </div>
                        }
                    </div>
                    {!isCard &&
                        <div className={listPictureClassName}>
                            {event.image_small ? (
                                <Image
                                    src={`${config.url.cdn}/img/events/${event.image_small}`}
                                    alt={event.image_small}
                                    fill={true}
                                    sizes='(min-width: 1000px) 22rem, (min-width: 800px) 50vw, 100vw'
                                    className={bannerImageClassName}
                                />
                            ) : (
                                getDefaultBanner(event.category.name_no, event.category.color, bannerImageClassName)
                            )}
                        </div>
                    }
                </div>
            </div>
        </Link>
    )
}

function getDefaultBanner(category: string, color: string, className: string) {
    switch (category) {
        case 'Sosialt':
            {/* @ts-ignore */}
            return <DefaultSocialBanner color={color} className={className} />
        case 'EvntKom':
            {/* @ts-ignore */}
            return <DefaultSocialBanner color={color} className={className} />
        case 'TekKom':
            {/* @ts-ignore */}
            return <DefaultTekkomBanner color={color} className={className} />
        case 'CTF':
            {/* @ts-ignore */}
            return <DefaultCtfBanner color={color} className={className} />
        case 'BedKom':
            {/* @ts-ignore */}
            return <DefaultBedpresBanner color={color} className={className} />
        default:
            {/* @ts-ignore */}
            return <DefaultEventBanner color={color} className={className} />
    }
}
