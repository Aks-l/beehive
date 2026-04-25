import config from '@config'
import DateTile from '@components/datetile/dateTile'
import DropDownBox from '@components/dropdownbox/dropDownBox'
import MazeMapEmbed from '@components/mazemap/mazeMapEmbed'
import EventSignUp from '../eventSignUp'
import Article from '@components/article/article'
import MarkdownRender from '@components/markdownrender/markdownRender'
import Alert from '@components/alert/alert'
import DefaultEventBanner from '@components/svg/defaultbanners/defaultEventBanner'
import DefaultCtfBanner from '@components/svg/defaultbanners/defaultCtfBanner'
import DefaultTekkomBanner from '@components/svg/defaultbanners/defaultTekkomBanner'
import DefaultBedpresBanner from '@components/svg/defaultbanners/defaultBedpresBanner'
import DefaultSocialBanner from '@components/svg/defaultbanners/defaultSocialBanner'
import no from '@text/eventPage/no.json'
import en from '@text/eventPage/en.json'
import ArrowOutward from '@components/svg/symbols/arrowOutward'
import Pin from '@components/svg/symbols/pin'
import SVGLink from '@components/svg/symbols/link'
import LiveTv from '@components/svg/symbols/liveTv'
import Person from '@components/svg/symbols/person'
import Gavel from '@components/svg/symbols/gavel'
import Category from '@components/svg/symbols/category'
import Schedule from '@components/svg/symbols/schedule'
import { getEvent } from '@utils/api'
import { formatEventStatusDate, formatTimeHHMM, isOngoing } from '@utils/datetimeFormatter'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

type EventBannerProps = {
    event: GetEventProps
}

export default async function EventPage({ params }: PromisedPageProps) {
    const id = (await params).id
    const event = await getEvent(Number(id))
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const errorMsg = lang === 'no' ? 'Oi! Her var det tomt... ' : 'Oh! Looks empty... '

    return (
        <>
            {typeof event !== 'string' && <Event event={event} />}
            {!event && (
                <Alert variant='danger' className='page-section--normal mt-32 mx-auto max-w-160'>
                    {errorMsg}
                </Alert>
            )}
        </>
    )
}

async function Event({ event }: { event: GetEventProps }) {
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const text = lang === 'no' ? no : en

    return (
        <div
            className="grid items-start grid-cols-1 [grid-template-areas:'ban''det''des''map']
                800px:grid-cols-[20rem_1fr] 800px:[grid-template-areas:'det_ban''det_des''map_des''._des']
                800px:gap-x-[6%] 800px:gap-y-8 800px:pt-12 800px:px-8
                800px:max-w-[calc(var(--w-page)+4rem)] 800px:mx-auto"
        >
            <div
                className='[grid-area:det] py-8 px-4 overflow-hidden relative
                    400px:p-8 800px:p-0 800px:bg-none
                    800px:before:content-[""] 800px:before:w-[2.6rem] 800px:before:h-[2.6rem]
                    800px:before:absolute 800px:before:border-[0.7rem]
                    800px:before:border-(--color-border-default)
                    800px:before:border-solid 800px:before:border-b-0 800px:before:border-l-0
                    800px:before:top-0 800px:before:right-0 800px:before:transition'
            >
                <div className='flex gap-4 mb-8 800px:mr-[1.3rem]'>
                    <DateTile
                        // @ts-ignore
                        startDate={new Date(event.time_start)}
                        // @ts-ignore
                        endDate={new Date(event.time_end)}
                        // @ts-ignore
                        color={event.category.color}
                    />
                    <div className='my-auto'>
                        <div className='flex items-center text-xl text-(--color-text-discreet)'>
                            {isOngoing(
                                // @ts-ignore
                                new Date(event.time_start),
                                // @ts-ignore
                                new Date(event.time_end),
                            ) && (
                                // @ts-ignore
                                <span
                                    className='w-[0.8rem] h-[0.8rem] rounded-full mr-[0.6rem] ml-[0.3rem]
                                        bg-green-500 animate-[event-ongoing-pulse_1.5s_infinite]'
                                />
                            )}
                            {formatEventStatusDate(
                                // @ts-ignore
                                new Date(event.time_start),
                                // @ts-ignore
                                new Date(event.time_end),
                                lang,
                            )}
                        </div>
                        {/* @ts-ignore */}
                        {event.time_type !== 'whole_day' && (
                            <div className='flex flex-row items-center text-[1.6rem] font-medium'>
                                <Schedule
                                    className='w-[1.8rem] h-[1.8rem] text-[1.8rem] mt-[-0.3rem] mr-[0.3rem] fill-(--color-text-main)'
                                />
                                {/* @ts-ignore */}
                                {event.time_type === 'to_be_determined' ? 'TBD' : formatTimeHHMM(new Date(event.time_start))}
                                {/* @ts-ignore */}
                                {event.time_type === 'default' && ` - ${formatTimeHHMM(new Date(event.time_end))}`}
                            </div>
                        )}
                    </div>
                </div>

                <div className='grid grid-cols-[min-content_auto] gap-4 my-4 mb-8'>
                    {/* @ts-ignore */}
                    {event.location && (
                        <>
                            <div className='inline-flex items-center text-(--color-text-discreet)'>
                                <Pin
                                    className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                />
                                {text.info.location}:
                            </div>
                            <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>
                                {/* @ts-ignore */}
                                {lang === 'en' && event.location.name_en ? event.location.name_en : event.location.name_no}
                                {/* @ts-ignore */}
                                {event.location.city_name && `, ${event.location.city_name}`}
                            </div>
                        </>
                    )}

                    <div className='inline-flex text-(--color-text-discreet)'>
                        <Category className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                        {text.info.type}:
                    </div>
                    <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>
                        {/* @ts-ignore */}
                        <span
                            className='inline-block w-4 h-4 rounded-full mr-2 translate-y-[0.2rem]'
                            style={{ background: event.category.color }}
                        />
                        {/* @ts-ignore */}
                        {lang === 'en' ? event.category.name_en : event.category.name_no}
                    </div>

                    {/* @ts-ignore */}
                    {event.organizations?.length > 0 && (
                        <>
                            <div className='inline-flex items-center text-(--color-text-discreet)'>
                                <Person className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                                {text.info.organizer}:
                            </div>
                            <div
                                className='flex flex-row items-center font-medium text-(--color-text-regular)
                                    wrap-break-word hyphens-auto'
                            >
                                {/* @ts-ignore */}
                                {renderOrganizations(event.organizations)}
                            </div>
                        </>
                    )}

                    {/* @ts-ignore */}
                    {event.link_stream && (
                        <>
                            <div className='inline-flex items-center text-(--color-text-discreet)'>
                                <LiveTv className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                                {text.info.stream}:
                            </div>
                            <div
                                className='flex flex-row items-center font-medium text-(--color-text-regular)
                                    wrap-break-word hyphens-auto'
                            >
                                {/* @ts-ignore */}
                                {link(event.link_stream, getURLAddress(event.link_stream))}
                            </div>
                        </>
                    )}

                    {/* @ts-ignore */}
                    {(event.link_discord || event.link_facebook) && (
                        <>
                            <div className='inline-flex items-center text-(--color-text-discreet)'>
                                <SVGLink className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                                {text.info.links}:
                            </div>
                            <div
                                className='flex flex-row items-center font-medium text-(--color-text-regular)
                                    wrap-break-word hyphens-auto'
                            >
                                {/* @ts-ignore */}
                                {event.link_discord && (
                                    <>
                                        {link(event.link_discord, 'Discord')}
                                        <br />
                                    </>
                                )}
                                {/* @ts-ignore */}
                                {event.link_facebook && link(event.link_facebook, 'Facebook')}
                            </div>
                        </>
                    )}
                </div>
                <EventSignUp
                    // @ts-ignore
                    cap={event.capacity}
                    // @ts-ignore
                    url={event.link_signup}
                    // @ts-ignore
                    full={event.full}
                    // @ts-ignore
                    canceled={event.canceled}
                    // @ts-ignore
                    signupRelease={new Date(event.time_signup_release)}
                    // @ts-ignore
                    signupDeadline={new Date(event.time_signup_deadline)}
                />
            </div>
            <div
                className='[grid-area:ban] bg-[rgba(100,100,100,0.3)] block aspect-10/4 w-full rounded-(--border-radius) overflow-hidden'
            >
                <EventBanner event={event} />
            </div>
            <div
                className='[grid-area:des] p-4 relative 400px:py-4 400px:px-8
                    800px:pt-0 800px:pr-12 800px:pb-12 800px:pl-0
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
                    // @ts-ignore
                    title={(event.canceled ? `❌ (${text.canceled})` : '') + (lang === 'en' ? event.name_en : event.name_no)}
                    // @ts-ignore
                    publishTime={new Date(event.time_publish)}
                    // @ts-ignore
                    updateTime={new Date(event.updated_at)}
                    // @ts-ignore
                    informational={lang === 'en' ? event.informational_en : event.informational_no}
                    // @ts-ignore
                    description={lang === 'en' ? event.description_en : event.description_no}
                />
                {/* @ts-ignore */}
                {event.rule && (
                    <div className='max-w-160 mt-16'>
                        <DropDownBox
                            title={
                                <>
                                    {/* @ts-ignore */}
                                    <Gavel className='fill-(--color-text-main) h-7' />
                                    {lang === 'en' ? event.rule.name_en : event.rule.name_no}
                                </>
                            }
                        >
                            <div className='pt-2 px-4 pb-4 800px:px-6'>
                                {/* @ts-ignore */}
                                <MarkdownRender MDstr={lang === 'en' ? event.rule.description_en : event.rule.description_no} />
                            </div>
                        </DropDownBox>
                    </div>
                )}
            </div>

            {/* @ts-ignore */}
            {event.location && event.location.type === 'mazemap' && (
                <div className='[grid-area:map] my-8 px-8 max-w-160 800px:px-0'>
                    {/* @ts-ignore */}
                    <MazeMapEmbed campusID={event.location.mazemap_campus_id} poi={event.location.mazemap_poi_id} />
                </div>
            )}
        </div>
    )
}

async function EventBanner({ event }: EventBannerProps) {
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const banner_url = `${config.url.cdn}/img/events/${event.image_banner}`
    if (!event || !((await fetch(banner_url)).status === 200)) {
        // @ts-ignore
        return getDefaultBanner(event?.category?.name_no, event?.category?.color)
    }

    return (
        <>
            <Image
                src={`${config.url.cdn}/img/events/${event.image_banner}`}
                alt={lang === 'no' ? event.name_no : event.name_en}
                width={1000}
                height={400}
                className='w-full rounded-var[(--border-radius)]'
            />
        </>
    )
}

function getDefaultBanner(category: string, color: string) {
    const bannerClassName = 'block w-full h-full object-cover'

    switch (category) {
        case 'Sosialt':
            {/* @ts-ignore */}
            return <DefaultSocialBanner color={color} className={bannerClassName} />
        case 'EvntKom':
            {/* @ts-ignore */}
            return <DefaultSocialBanner color={color} className={bannerClassName} />
        case 'TekKom':
            {/* @ts-ignore */}
            return <DefaultTekkomBanner color={color} className={bannerClassName} />
        case 'CTF':
            {/* @ts-ignore */}
            return <DefaultCtfBanner color={color} className={bannerClassName} />
        case 'BedKom':
            {/* @ts-ignore */}
            return <DefaultBedpresBanner color={color} className={bannerClassName} />
        default:
            {/* @ts-ignore */}
            return <DefaultEventBanner color={color} className={bannerClassName} />
    }
}

function getURLAddress(url: string) {
    try {
        return new URL(url).hostname
    } catch {
        return url
    }
}

// eslint-disable-next-line
function renderOrganizations(organizations: any[]) {
    if (!Array.isArray(organizations)) return null
    return organizations.map((org) => org.name_no).join(', ')
}

function link(href: string, name: string) {
    return (
        <Link className='flex flex-row items-center link link--primary hover:underline' href={href} target='_blank' rel='noreferrer'>
            {name} <ArrowOutward className='w-6 h-6 fill-(--color-text-discreet)' />
        </Link>
    )
}
