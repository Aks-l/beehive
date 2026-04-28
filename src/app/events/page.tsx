import EventListItem from '@components/event/eventItem'
import GroupToggle from '@components/grouptoggle/groupToggle'
import prepFilter, { type FilterDefinition, type FilterSourceValue } from '@components/filter/prepFilter'
import no from '@text/eventList/no.json'
import en from '@text/eventList/en.json'
import GridView from '@components/svg/symbols/gridView'
import ListBulleted from '@components/svg/symbols/listBulleted'
import { getEventCategoryFilters, getEvents } from '@utils/api'
import { cookies } from 'next/headers'
import FilterItem from '@components/filter/filterItem'
import Button from '@components/button/button'
import Download from '@components/svg/symbols/download'
import { normalizeLang } from '@utils/lang'

type PageProps = {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({searchParams}: PageProps) {
    const filters = (await searchParams)
    const eventsView = filters.view ? `${filters.view}-view` : 'list-view'
    const categories = typeof filters.categories === 'string' ? filters.categories : undefined
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en
    const limit = 20
    const eventsResponse = await getEvents({
        categories,
        orderBy: 'time_start',
        limit
    })

    const events = (typeof eventsResponse === 'string'
        ? []
        : (Array.isArray(eventsResponse.events) ? eventsResponse.events : []))
        .filter((event: GetEventProps) => {
            const start = new Date(event.time_end).getTime()
            const now = new Date().getTime()
            return start - now > 0
        })
    const { currentWeekEvents, nextWeekEvents, futureEvents } = groupEvents(events)

    const response: Record<string, FilterDefinition> = {}

    const categoryFilters = await getCategoryFilters()
    if (categoryFilters) {
        response.categories = categoryFilters
    }

    return (
        <div className='page-container'>
            <div className='page-section--normal'>
                <h1 className='heading-1 heading-1--top-left-corner'>{text.title}</h1>
            </div>
            <div className='hidden 1000px:flex justify-end pb-4 page-section--normal'>
                <div className='justify-end'>
                    <GroupToggle
                        options={[
                            {
                                leadingIcon: (
                                    <GridView className='w-6 fill-(--color-text-main)' />
                                ),
                                name: 'grid'
                            },
                            {
                                leadingIcon: (<ListBulleted className='w-6 fill-(--color-text-main)' />),
                                name: 'list'
                            },
                        ]}
                        groupVariant='ghost'
                        buttonVariant='ghost'
                        size='medium'
                    />
                </div>
            </div>
            <div className='page-section--without-gaps'>
                <div className='p-[0_0.5rem] 400px:p-[0_1rem] 800px:p-[0_2rem]
                1000px:grid 1000px:grid-cols-[17rem_auto] 1000px:gap-[3vw]'>
                    <div className='1000px:order-1 flex flex-col'>
                        <div className='w-full'>
                            <FilterItem filterData={response} />
                            <div className='hidden 1000px:block pt-8'>
                                <Button
                                    size='medium'
                                    variant='secondary-outlined'
                                    target='_self'
                                    trailingIcon={<Download className='w-6 h-6 fill-(--color-text-regular)'/>}
                                    href='https://workerbee.login.no/api/calendar'
                                >
                                    {text.calendar}
                                </Button>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center right-0 left-28
                            justify-between absolute mx-2 400px:mx-4 800px:mx-8
                            1000px:hidden'
                        >
                            <div className='hidden 500px:inline-flex'>
                                <Button
                                    size='medium'
                                    variant='secondary-outlined'
                                    target='_self'
                                    trailingIcon={<Download className='w-6 h-6 fill-(--color-text-regular)'/>}
                                    href='https://workerbee.login.no/api/calendar'
                                >
                                    {text.calendar}
                                </Button>
                            </div>
                            <Button
                                className='500px:hidden'
                                size='medium'
                                variant='secondary-outlined'
                                target='_self'
                                leadingIcon={<Download className='w-6 h-6 fill-(--color-text-regular)'/>}
                                href='https://workerbee.login.no/api/calendar'
                            />
                            <GroupToggle
                                options={[
                                    {
                                        leadingIcon: (
                                            <GridView className='w-6 fill-(--color-text-main)' />
                                        ),
                                        name: 'grid'
                                    },
                                    {
                                        leadingIcon: (<ListBulleted className='w-6 fill-(--color-text-main)' />),
                                        name: 'list'
                                    },
                                ]}
                                groupVariant='secondary-outlined'
                                size='medium'
                            />
                        </div>
                    </div>
                    <div className='1000px:order-2'>
                        <ul
                            className={`list-none pt-4 1000px:pt-0 events_list${
                                eventsView === 'grid-view'
                                    ? '--grid-view grid grid-cols-1 gap-4 600px:grid-cols-2 800px:gap-8'
                                    : '--list-view'
                            }`}
                        >

                            {currentWeekEvents?.length > 0 && (
                                <>
                                    {eventsView == 'list-view' && (
                                        <div className='relative m-[1.2rem_0.5rem_0.2rem_0.5rem]
                                            before:content-[""] before:absolute before:top-[50%]
                                            before:w-full before:h-[0.13rem] before:bg-(--color-border-default)
                                            600px:mr-4 600px:ml-4 mt-[0.2rem]'>
                                            <p className='g-(--color-bg-body)] text-(--color-text-discreet)
                                                font-medium text-[0.9rem] tracking-[0.15em] w-fit p-[0_1rem]
                                                m-[0_auto] z-2 block relative'>
                                                {text.thisWeek}
                                            </p>
                                        </div>
                                    )}
                                    {currentWeekEvents.map((e, idx) => (
                                        <li key={idx}>
                                            <EventListItem
                                                key={e.id}
                                                event={e}
                                                highlight={e.highlight}
                                                variant={
                                                    eventsView === 'grid-view'
                                                        ? 'card'
                                                        : 'list-item'
                                                }
                                            />
                                        </li>
                                    ))}
                                </>
                            )
                            }

                            {nextWeekEvents?.length > 0 && (
                                <>
                                    {eventsView == 'list-view' && (
                                        <div className='relative m-[1.2rem_0.5rem_0.2rem_0.5rem]
                                            before:content-[""] before:absolute before:top-[50%]
                                            before:w-full before:h-[0.13rem] before:bg-(--color-border-default)
                                            600px:mr-4 600px:ml-4'>
                                            <p className='bg-(--color-bg-body)
                                                text-(--color-text-discreet)
                                                font-medium text-[0.9rem]
                                                tracking-[0.15em] w-fit p-[0_1rem]
                                                m-[0_auto] z-2 block relative'>
                                                {text.nextWeek}
                                            </p>
                                        </div>
                                    )}
                                    {nextWeekEvents.map((e, idx) => (
                                        <li key={idx}>
                                            <EventListItem
                                                key={e.id}
                                                event={e}
                                                highlight={e.highlight}
                                                variant={
                                                    eventsView === 'grid-view'
                                                        ? 'card'
                                                        : 'list-item'
                                                }
                                            />
                                        </li>
                                    ))}
                                </>
                            )
                            }

                            {futureEvents?.length > 0 && (
                                <>
                                    {eventsView == 'list-view' && currentWeekEvents?.length + nextWeekEvents?.length > 0 && (
                                        <div className='relative m-[1.2rem_0.5rem_0.2rem_0.5rem]
                                            before:content-[""] before:absolute before:top-[50%]
                                            before:w-full before:h-[0.13rem] before:bg-(--color-border-default)
                                            600px:mr-4 600px:ml-4'>
                                            <p className='bg-(--color-bg-body)
                                                text-(--color-text-discreet)
                                                font-medium text-[0.9rem]
                                                tracking-[0.15em]
                                                w-fit p-[0_1rem] m-[0_auto]
                                                z-2 block relative'>
                                                {text.later}
                                            </p>
                                        </div>
                                    )}
                                    {futureEvents.map((e, idx) => (
                                        <li key={idx}>
                                            <EventListItem
                                                key={e.id}
                                                event={e}
                                                highlight={e.highlight}
                                                variant={
                                                    eventsView === 'grid-view'
                                                        ? 'card'
                                                        : 'list-item'
                                                }
                                            />
                                        </li>
                                    ))}
                                </>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getLabelKeyWithLang(key: string) {
    return (value: FilterSourceValue) => {
        const labelNo = String(value[`${key}_no`] ?? '')
        const labelEn = String(value[`${key}_en`] ?? labelNo)

        return {
            no: labelNo,
            en: labelEn,
        }
    }
}

async function getCategoryFilters() {
    try {
        const categoryFilterData = await getEventCategoryFilters()
        if (typeof categoryFilterData === 'string') {
            throw new Error(categoryFilterData)
        }

        const title = {
            en: 'Categories',
            no: 'Kategorier',
        }

        return prepFilter(
            categoryFilterData,
            'categories',
            title,
            'id',
            getLabelKeyWithLang('name'),
            'count',
            'check',
            true
        )
    } catch(error) {
        console.error(`Error fetching category filters: ${error}`)
        return null
    }
}

function groupEvents(eventsArray: GetEventProps[]) {
    // Get the current date
    const currentDate = new Date()

    // Calculate the start of the current week (Monday)
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    startOfWeek.setHours(0)
    startOfWeek.setMinutes(0)
    startOfWeek.setSeconds(0)

    // Calculate the start of the next week
    const startOfNextWeek = new Date(startOfWeek)
    startOfNextWeek.setDate(startOfWeek.getDate() + 7)

    // Calculate the start of the week after next week
    const startOfWeekAfterNextWeek = new Date(startOfWeek)
    startOfWeekAfterNextWeek.setDate(startOfWeek.getDate() + 14)

    // group the dates
    const currentWeekEvents: GetEventProps[] = []
    const nextWeekEvents: GetEventProps[] = []
    const futureEvents: GetEventProps[] = []

    eventsArray.forEach((event) => {
        const eventDate = new Date(event.time_start)

        if (eventDate >= startOfWeek && eventDate < startOfNextWeek) {
            currentWeekEvents.push(event)
        } else if (
            eventDate >= startOfNextWeek &&
            eventDate < startOfWeekAfterNextWeek
        ) {
            nextWeekEvents.push(event)
        } else {
            futureEvents.push(event)
        }
    })

    return {
        currentWeekEvents,
        nextWeekEvents,
        futureEvents,
    }
}
