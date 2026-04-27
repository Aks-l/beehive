import config from '@config'
import LogChamp from '@components/logchamp/logChamp'
import DecoratedPicture from '@components/images/decoratedpicture/decoratedPicture'
import no from '@text/fund/no.json'
import en from '@text/fund/en.json'
import Chart from '@components/svg/symbols/chart'
import Group from '@components/svg/symbols/group'
import Diversity from '@components/svg/symbols/diversity'
import ChartDetailed from '@components/svg/symbols/chartDetailed'
import Office from '@components/svg/symbols/office'
import HoldingsTotalLive from './holdings'
import HoldingsHistory from './holdingsHistory'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function Fund() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const locale = lang === 'en' ? 'en-GB' : 'nb-NO'
    // eslint-disable-next-line
    const text: any = lang === 'en' ? {...en} : {...no}

    const boardMembers = text.board.members
    const boardMemberKeys = Object.keys(boardMembers)
    const actualBoardMembers = Array.isArray(boardMemberKeys) ? boardMemberKeys : []

    return (
        <div className='page-container'>
            <div className='page-section--normal'>
                <h1 className='heading-1 heading-1--top-left-corner'>{text.title}</h1>
            </div>
            <section className='page-section--normal mb-8'>
                <p className='p-highlighted'>{text.intro}</p>
            </section>
            <section className='page-section--without-gaps mb-20
                bg-(--color-bg-surface) p-4 800px:p-[1rem_2rem_2rem_2rem]
                1200px:p-[1rem_3rem_2rem_3rem] 1200px:mx-8
                1200px:rounded-(--border-radius-large)'
            >
                <h2 className='heading-2'>{text.holdings.title}</h2>
                <HoldingsTotalLive
                    locale={locale}
                    text={text.holdings}
                    refreshMs={10000}
                />
                <HoldingsHistory
                    locale={locale}
                    text={text.holdings.history}
                    refreshMs={300000}
                />
            </section>
            <section className='page-section--without-gaps mb-20
                bg-(--color-bg-surface) p-4 800px:p-[1rem_2rem_2rem_2rem]
                1200px:p-[1rem_3rem_2rem_3rem] 1200px:mx-8
                1200px:rounded-(--border-radius-large)'
            >
                <h2 className='heading-2'>{text.support.title}</h2>
                <p className='p-highlighted' dangerouslySetInnerHTML={{__html: text.support.intro}}/>
                <h3 className='heading-4'>{text.support.heading1}</h3>
                <p className='p-regular'>{text.support.body1}</p>
                <h3 className='heading-4'>{text.support.heading2}</h3>
                <p className='p-regular'>{text.support.body2}</p>
                <h3 className='heading-4'>{text.support.heading3}</h3>
                <p className='p-regular' dangerouslySetInnerHTML={{__html: text.support.body3}}/>
            </section>
            <section className='page-section--normal mb-20'>
                <div className='fund-section_container 800px:grid 800px:grid-cols-2 800px:gap-16'>
                    {/* @ts-ignore */}
                    <div className='fund-section_container--grid-item'>
                        <h2 className='flex flex-row heading-2 heading-2--icon'>
                            <Chart className='w-12 h-12 fill-(--color-text-main) mr-4'/>
                            <span>{text.purpose.title}</span>
                        </h2>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.purpose.body}}/>
                    </div>
                    {/* @ts-ignore */}
                    <div className='fund-section_container--grid-item'>
                        <h2 className='heading-2 heading-2--icon'>
                            <Group className='w-12 h-12 fill-(--color-text-main) mr-4'/>
                            <span>{text.meeting.title}</span>
                        </h2>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.meeting.body}}/>
                    </div>
                </div>
                <div className='fund-section_container 800px:grid 800px:grid-cols-2 800px:gap-16'>
                    {/* @ts-ignore */}
                    <div className='fund-section_container--grid-item'>
                        <h2 className='heading-2 heading-2--icon'>
                            <Diversity className='w-12 h-12 fill-(--color-text-main) mr-4'/>
                            <span>{text.application.title}</span>
                        </h2>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.application.body}}/>
                    </div>
                    {/* @ts-ignore */}
                    <div className='fund-section_container--grid-item'>
                        <h2 className='heading-2 heading-2--icon'>
                            <ChartDetailed className='w-12 h-12 fill-(--color-text-main) mr-4'/>
                            <span>{text.yield.title}</span>
                        </h2>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.yield.body}}/>
                    </div>
                </div>
            </section>
            <section className='page-section--without-gaps mb-20
                bg-(--color-bg-surface) p-4 800px:p-[1rem_2rem_2rem_2rem]
                1200px:p-[1rem_3rem_2rem_3rem] 1200px:mx-8
                1200px:rounded-(--border-radius-large)'
            >
                <div className='fund-section_container fund-board'>
                    <h2 className='heading-2 heading-2--icon'>
                        <Office className='w-12 h-12 fill-(--color-text-main) mr-[0.4em] text-[1.2em] leading-[inherit] align-top'/>
                        <span>{text.board.title}</span>
                    </h2>
                    <div className='flex flex-wrap justify-center gap-12 mb-16'>
                        {/* @ts-ignore */}
                        <div className='box-border flex-[1_1_20rem] m-auto'>
                            <p className='p-highlighted'>{text.board.intro}</p>
                            <p className='p-regular' dangerouslySetInnerHTML={{__html: text.board.body}}/>
                        </div>
                        <div className='box-border flex-[1_1_20rem] my-auto max-w-132'>
                            <DecoratedPicture
                                imgUrl={config.url.cdn+'/img/fund/group.jpg'}
                                variant={4}
                                cornerSize={90}
                                width={300}
                                height={220}
                                cover={true}
                            />
                        </div>
                    </div>
                    <h3 className='heading-3'>{text.board.heading1}</h3>
                    <div className='flex flex-wrap gap-8 justify-center py-8 800px:gap-12'>
                        {Array.isArray(actualBoardMembers) && actualBoardMembers.map(key => (
                            <div key={key}>
                                <LogChamp
                                    img={boardMembers[key].img == ''
                                        ? 'assets/img/placeholders/portrett_placeholder.svg'
                                        : `${config.url.cdn}/img/fund/${boardMembers[key].img}`}
                                    name={boardMembers[key].name == ''
                                        ? boardMembers[key].title
                                        : boardMembers[key].name}
                                    position={boardMembers[key].title}
                                    discord={boardMembers[key].dctag}
                                    discordLink={boardMembers[key].dclink}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
