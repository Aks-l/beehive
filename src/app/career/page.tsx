import JobadsListItem from '@components/jobad/jobadsListItem'
import Alert from '@components/alert/alert'
import prepFilter, { type FilterDefinition, type FilterSourceValue } from '@components/filter/prepFilter'
import { getJobs, getJobCityFilters, getJobSkillFilters, getJobJobtypeFilters } from '@utils/api'
import no from '@text/jobadList/no.json'
import en from '@text/jobadList/en.json'
import { cookies } from 'next/headers'
import FilterItem from '@components/filter/filterItem'
import { normalizeLang } from '@utils/lang'

export default async function Jobads({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams

    const jobtypes = typeof filters.jobtypes === 'string' ? filters.jobtypes : null
    const cities = typeof filters.cities === 'string' ? filters.cities : null
    const skills = typeof filters.skills === 'string' ? filters.skills : null

    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    const response: Record<string, FilterDefinition> = {}

    const jobtypeFilters = await getJobTypeFilters()
    if (jobtypeFilters) response.jobtypes = jobtypeFilters

    const cityFilters = await getCityFilters()
    if (cityFilters) response.cities = cityFilters

    const skillFilters = await getSkillFilters()
    if (skillFilters) response.skills = skillFilters

    const limit = 10

    const jobads = await getJobs(skills, cities, null, jobtypes, limit, 0)
    return (
        <div className='page-container'>
            <h1 className='page-section--normal heading-1 heading-1--top-left-corner'>{text.title}</h1>
            <div className='page-section--normal'>
                <div className='1000px:grid 1000px:grid-cols-[20rem_auto] 1000px:gap-[3vw] 1000px:p-[2rem_0]'>
                    <div className='order-1'>
                        <FilterItem filterData={response} />
                    </div>
                    <div className='order-2'>
                        <ul className='list-none pt-6 1000px:pt-0'>
                            {typeof jobads !== 'string' && Array.isArray(jobads.jobs) && jobads.jobs.length ? (
                                jobads.jobs.map((e: GetJobProps, idx: number) => (
                                    <li key={idx}>
                                        <JobadsListItem jobad={e} />
                                    </li>
                                ))
                            ) : (
                                <Alert variant='info' className='page-section--normal mt-32 mx-auto max-w-160'>
                                    {lang === 'no'
                                        ? 'Oi! Her var det tomt... Kanskje din bedrift kunne vært interessert i å annonsere her?'
                                        : 'Oh! Looks empty... Maybe your company would be interested in advertising here?'}
                                </Alert>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getLabelKey(key: string) {
    return (value: FilterSourceValue) => {
        const label = String(value[key] ?? '')

        return {
            no: label,
            en: label,
        }
    }
}

function getJobTypeLabel(value: FilterSourceValue) {
    return {
        no: String(value.name_no ?? ''),
        en: String(value.name_en ?? value.name_no ?? ''),
    }
}

async function getJobTypeFilters() {
    try {
        const jobTypeFilterData = await getJobJobtypeFilters()
        if (typeof jobTypeFilterData === 'string') throw new Error(jobTypeFilterData)

        const label = {
            en: 'Type',
            no: 'Type',
        }

        return prepFilter(jobTypeFilterData, 'jobtypes', label, 'id', getJobTypeLabel, 'total_count', 'check')
    } catch (error) {
        console.error('Error fetching job type filters:', error)
        return null
    }
}

async function getCityFilters() {
    try {
        const jobCityFilterData = await getJobCityFilters()
        if (typeof jobCityFilterData === 'string') throw new Error(jobCityFilterData)

        const label = {
            en: 'Cities',
            no: 'Byer',
        }

        return prepFilter(jobCityFilterData, 'cities', label, 'name', getLabelKey('name'), 'count', 'tag')
    } catch (error) {
        console.error('Error fetching city filters:', error)
        return null
    }
}

async function getSkillFilters() {
    try {
        const jobSkillFilterData = await getJobSkillFilters()
        if (typeof jobSkillFilterData === 'string') throw new Error(jobSkillFilterData)

        const label = {
            en: 'Skills',
            no: 'Ferdigheter',
        }

        return prepFilter(jobSkillFilterData, 'skills', label, 'name', getLabelKey('name'), 'count', 'tag')
    } catch (error) {
        console.error('Error fetching skill filters:', error)
        return null
    }
}
