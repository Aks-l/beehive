import HeroSection from '@components/herosection/heroSection'
import EventsPreview from '@components/event/preview'
import JobadsPreview from '@components/jobad/preview'
import SmallInfo from '@components/smallInfo'
import MusicPreviewClient from '@components/music/preview/previewClient'
import Announcement from '@components/announcement/announcement'
import { getActivity } from '@utils/api'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

async function MusicPreview() {
    const data = await getActivity()
    const lang = normalizeLang((await cookies()).get('lang')?.value)

    return <MusicPreviewClient test-id='music' initialData={data} lang={lang} />
}

export default async function Home() {
    return (
        <>
            <HeroSection />
            <Announcement />
            <EventsPreview />
            <JobadsPreview />
            <MusicPreview />
            <SmallInfo />
        </>
    )
}
