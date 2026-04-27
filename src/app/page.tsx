import HeroSection from '@components/herosection/heroSection'
import EventsPreview from '@components/event/preview'
import JobadsPreview from '@components/jobad/preview'
import SmallInfo from '@components/smallInfo'
import MusicPreview from '@components/music/preview/preview'
import Announcement from '@components/announcement/announcement'

export default function Home() {
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
