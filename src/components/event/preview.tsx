import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import Link from 'next/link'
import EventListItem from '@components/event/eventItem'
import EndCard from '@components/endCard'
import { getEvents } from '@utils/api'
import { cookies } from 'next/headers'
import { Egg } from '@components/decoration/easter'
import { Decoration } from '@components/decoration/wrapper'
import { normalizeLang } from '@utils/lang'

export default async function EventsPreview() {
    const eventsResponse = await getEvents({
        orderBy: 'time_start',
        limit: 3,
        highlighted: true
    })

    const events = (typeof eventsResponse === 'string'
        ? []
        : (Array.isArray(eventsResponse.events) ? eventsResponse.events : []))
        .filter((event: GetEventProps) => {
            const start = new Date(event.time_end).getTime()
            const now = new Date().getTime()
            return start - now > 0
        })

    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <>
            <section  test-id='events' className='pt-8 max-w-(--w-page) 800px:px-4 800px:mx-auto 1000px:w-full relative'>
                <Decoration type='easter'>
                    <div className='absolute -left-4 bottom-20 hidden lg:block opacity-80 pointer-events-none'>
                        <Egg color='#b5ead7' className='w-12' rotation={-10} />
                    </div>
                </Decoration>
                <div className='flex justify-between items-center px-8 1000px:px-4'>
                    <h2 className='py-2 font-normal text-2xl'>
                        {text.eventsPreview.title}
                    </h2>
                    <Link
                        href='/events'
                        className='group relative block p-[.5em_1.5em_.5em_1em]
                            leading-[1.4em] text-[1.2rem] font-medium h-[2.4em]
                            after:content-[""] after:absolute after:w-[0.6em]
                            after:h-[0.6em] after:top-[0.85em] after:right-[0.5em]
                            after:border-r-[0.18em] after:border-b-[0.18em]
                            after:border-solid after:border-(--color-link-primary)
                            after:transform after:-rotate-45 after:z-5 after:transition-all'
                    >
                        <span className='hidden 350px:block group-hover:text-(--color-link-primary)'>
                            {text.eventsPreview.seeAll}
                        </span>
                    </Link>
                </div>
                {typeof events !== 'string' && Array.isArray(events) && events.length > 0 && (
                    <ul
                        className='relative grid grid-flow-col list-none overflow-auto
                            p-[0_1rem_1rem_1rem] snap-x snap-mandatory 400px:gap-4
                            800px:grid-cols-2 800px:grid-flow-row-dense 800px:gap-8
                            1000px:grid-cols-3 1000px:gap-4 1000px:p-0'
                    >
                        {/* eslint-disable-next-line */}
                        {events.map((e: any) => (
                            <li key={e.id} className='snap-center w-[80vw] max-w-88 min-w-72 800px:w-full 800px:max-w-md 1000px:m-[0_auto]'>
                                <EventListItem event={e} variant='card' highlight={false} />
                            </li>
                        ))}
                        {events.length > 2 && <EndCard path='/events' />}
                    </ul>
                )}
            </section>
            <hr
                className='hidden 800px:block 800px:border-0 800px:h-[0.15rem]
                    800px:bg-(--color-border-default) 800px:my-0 800px:mx-12
                    1000px:my-8 1000px:mx-auto 1000px:max-w-[calc(var(--w-page)-4rem)]'
            />
        </>
    )
}
