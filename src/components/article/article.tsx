import MarkdownRender from '@components/markdownrender/markdownRender'
import Alert from '@components/alert/alert'
import { formatPublishedDate } from '@utils/datetimeFormatter'

type ArticleProps = {
    lang: Lang
    title: string
    publishTime: Date
    updateTime: Date
    informational: boolean
    introduction?: string
    description: string
}

export default function Article({ lang, title, publishTime, updateTime, informational, introduction, description }: ArticleProps) {
    return (
        <div className='wrap-break-word'>
            <h1 className='my-[0.2em] text-[1.9rem] leading-[1.2em] font-normal 400px:text-[2rem] 800px:text-[2.3rem]'>{title}</h1>
            <div className='m-[0.8rem_0_1.5rem_0] flex flex-wrap gap-x-4 p-0'>
                <span className='text-[0.9rem] text-(--color-text-discreet)'>
                    {lang === 'en' ? 'PUBLISHED: ' : 'PUBLISERT: '}
                    {formatPublishedDate(publishTime, lang)}
                </span>
                {publishTime < updateTime &&
                    <span className='text-[0.9rem] text-(--color-text-discreet)'>
                        {lang === 'en' ? 'UPDATED: ' : 'OPPDATERT: '}
                        {formatPublishedDate(updateTime, lang)}
                    </span>
                }
            </div>
            {informational && (
                <div className='my-4 max-w-160'>
                    {/* @ts-ignore */}
                    <Alert className='text-[1.1rem]'>
                        {informational}
                    </Alert>
                </div>
            )}
            {introduction &&
                <article
                    className='p-highlighted 800px:max-w-180'
                    dangerouslySetInnerHTML={{ __html: introduction }}
                />
            }
            <article>
                <MarkdownRender MDstr={description}/>
            </article>
        </div>
    )
}
