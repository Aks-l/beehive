import CommitteeTabs from './committeeTabs'
import StudyPrograms from './studyPrograms'
import DecoratedPicture from '@components/images/decoratedpicture/decoratedPicture'
import Contact from '@components/contact/contact'
import no from '@text/about/no.json'
import en from '@text/about/en.json'
import { cookies } from 'next/headers'
import config from '@config'
import { normalizeLang } from '@utils/lang'

export default async function About() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <div className='page-container'>
            <h1 className='page-section--normal heading-1 heading-1--top-left-corner'>
                {text.title}
            </h1>
            <section className='page-section--normal 800px:mb-20 about-intro'>
                <p
                    className='mt-0 max-w-200 p-highlighted'
                    dangerouslySetInnerHTML={{ __html: text.intro }}
                />
                <div className={'flex flex-wrap items-start justify-center gap-[5%] ' +
                    '800px:flex-nowrap 800px:p-[1rem_0] about-intro_grid-container'}>
                    <StudyPrograms lang={lang} />
                    <DecoratedPicture
                        imgUrl={`${config.url.cdn}/img/board/group/styret_2026.jpg`}
                        variant={3}
                        cornerSize={90}
                        width={300}
                        height={200}
                        cover={true}
                        className='max-w-132 w-full m-[3rem_0_1rem_0] 800px:m-0'
                    />
                </div>
            </section>
            <section className='page-section--normal mb-8 800px:mb-20'>
                <h2 className='heading-2'>{text.about.title}</h2>
                <div className='800px:my-4 800px:columns-2 800px:gap-16 800px:[column-rule:0.2rem_solid_var(--color-border-default)]'>
                    <p
                        className='p-highlighted 800px:mt-0'
                        dangerouslySetInnerHTML={{ __html: text.about.intro }}
                    />
                    <p
                        className='p-regular'
                        dangerouslySetInnerHTML={{ __html: text.about.body.p1 }}
                    />
                    <p
                        className='p-regular'
                        dangerouslySetInnerHTML={{ __html: text.about.body.p2 }}
                    />
                </div>
            </section>
            <section className='page-section--normal about-committees'>
                <h2 className='heading-2'>{text.committeeSection.title}</h2>
                <p className='p-regular'>{text.committeeSection.intro}</p>
            </section>
            <CommitteeTabs lang={lang} />
            <section className='page-section--normal 800px:mb-20'>
                <h2 className='heading-2'>{text.publicDocs.title}</h2>
                <p
                    className='p-regular'
                    dangerouslySetInnerHTML={{ __html: text.publicDocs.body }}
                />
                <ul
                    className='list-none [&>li]:text-(--color-text-regular) [&>li]:before:content-["\2022"]
                        [&>li]:before:text-(--color-primary) [&>li]:before:font-bold
                        [&>li]:before:inline-block [&>li]:before:w-[1em] [&>li]:before:ml-[0.5em]'
                >
                    <li>{text.publicDocs.bulletPoints.agendas}</li>
                    <li>{text.publicDocs.bulletPoints.minutes}</li>
                    <li>{text.publicDocs.bulletPoints.budgets}</li>
                    <li>{text.publicDocs.bulletPoints.honoraryMember}</li>
                    <li>{text.publicDocs.bulletPoints.bylaws}</li>
                </ul>
            </section>
            <div className='page-section--normal'>
                <Contact />
            </div>
        </div>
    )
}
