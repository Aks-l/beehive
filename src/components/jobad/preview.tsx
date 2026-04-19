import Link from 'next/link'
import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import EndCard from '@components/endCard'
import JobadCard from './jobadCard'
import { getJobs } from '@utils/api'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function JobadsPreview() {
    const jobads = await getJobs(null, null, null, null, 3, 0)
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <>
            <section test-id='jobs' className='pt-8 max-w-(--w-page) 800px:px-4 800px:mx-auto 1000px:w-full'>
                <div className='flex justify-between items-center px-8 1000px:px-4'>
                    <h2 className='py-2 font-normal text-2xl'>
                        {text.jobadsPreview.title}
                    </h2>
                    <Link
                        href='/career'
                        className='group relative block p-[.5em_1.5em_.5em_1em]
                            leading-[1.4em] text-[1.2rem] font-medium h-[2.4em]
                            after:content-[""] after:absolute after:w-[0.6em]
                            after:h-[0.6em] after:top-[0.85em] after:right-[0.5em]
                            after:border-r-[0.18em] after:border-b-[0.18em]
                            after:border-solid after:border-(--color-link-primary)
                            after:transform after:-rotate-45 after:z-5 after:transition-all'
                    >
                        <span className='hidden 350px:block group-hover:text-(--color-link-primary)'>
                            {text.jobadsPreview.seeAll}
                        </span>
                    </Link>
                </div>
                {typeof jobads !== 'string' && Array.isArray(jobads.jobs) && jobads.jobs.length > 0 && (
                    <ul
                        className='relative grid grid-flow-col list-none overflow-auto
                            p-[0_1rem_1rem_1rem] snap-x snap-mandatory 400px:gap-4
                            800px:grid-cols-2 800px:grid-flow-row-dense 800px:gap-8
                            1000px:grid-cols-3 1000px:gap-4 1000px:p-0'
                    >
                        {/* eslint-disable-next-line */}
                        {jobads.jobs.map((e: any) => (
                            <li key={e.id} className='snap-center w-[80vw] max-w-88 min-w-72 800px:w-full 800px:max-w-md 1000px:m-[0_auto]'>
                                <JobadCard jobad={e} />
                            </li>
                        ))}
                        {jobads.jobs.length > 2 && <EndCard path='/career' />}
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
