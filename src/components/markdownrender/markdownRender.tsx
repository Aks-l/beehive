import type { ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EventItem from '@components/event/eventItem'
import JobadCard from '@components/jobad/jobadCard'
import Alert from '@components/alert/alert'
import { getEventRow, getJobRow } from '@utils/api'
import Link from 'next/link'
import clsx from '@utils/clsx'

type CustomLinkProps = {
    href: number
    children: ReactNode
}

type ErrorMessageProps = {
    // eslint-disable-next-line
    err: any
    title: string
}

const components = {
    // The md string should not contain a main header (#), the h1 header is
    // rendered by the parent component. If by mistake it cointains
    // a '# main header' this returns h2 instead.
    h1: ({children}: {children: ReactNode}) => (
        <h2 className={clsx(
            'my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)',
            'font-normal text-[1.6rem] 400px:text-[1.7rem] 800px:text-[2rem]'
        )}
        >
            {children}
        </h2>
    ),
    h2: ({children}: {children: ReactNode}) => (
        <h2 className={clsx(
            'my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)',
            'font-normal text-[1.6rem] 400px:text-[1.7rem] 800px:text-[2rem]'
        )}
        >
            {children}
        </h2>
    ),
    h3: ({children}: {children: ReactNode}) => (
        <h3 className={clsx(
            'my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)',
            'font-normal text-[1.3rem] 400px:text-[1.4rem] 800px:text-[1.7rem]'
        )}
        >
            {children}
        </h3>
    ),
    h4: ({children}: {children: ReactNode}) => (
        <h4 className={clsx(
            'my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)',
            'font-semibold text-base 400px:text-[1.1rem] 800px:text-[1.4rem]'
        )}
        >
            {children}
        </h4>
    ),
    h5: ({children}: {children: ReactNode}) => (
        <h5 className='my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)'>{children}</h5>
    ),
    h6: ({children}: {children: ReactNode}) => (
        <h6 className='my-[1.5em] mb-[0.5em] leading-[1.2em] text-(--color-text-main)'>{children}</h6>
    ),
    p:  ({children}: {children: ReactNode}) => <section className='my-4 max-w-160 text-(--color-text-regular)'>{children}</section>,
    em: ({children}: {children: ReactNode}) => <em>{children}</em>,
    strong: ({children}: {children: ReactNode}) => <strong className='font-semibold text-(--color-text-main)'>{children}</strong>,
    table: ({children}: {children: ReactNode}) => <table className='my-4 w-full border-collapse'>{children}</table>,
    th: ({children}: {children: ReactNode}) => <th className='border-[0.1rem] border-(--color-border-default) px-4 py-2'>{children}</th>,
    td: ({children}: {children: ReactNode}) => <td className='border-[0.1rem] border-(--color-border-default) px-4 py-2'>{children}</td>,
    ul: ({children}: {children: ReactNode}) => <ul className='my-4 ml-6 list-disc marker:text-(--color-text-primary)'>{children}</ul>,
    ol: ({children}: {children: ReactNode}) => <ol className='my-4 ml-6 list-decimal'>{children}</ol>,
    li: ({children}: {children: ReactNode}) => <li className='text-(--color-text-regular)'>{children}</li>,
    code: ({children}: {children: ReactNode}) => (
        <code className='rounded-(--border-radius) bg-(--color-bg-surface) p-4 font-mono'>
            {children}
        </code>
    ),
    a: CustomLink
}

export default function MarkdownRender({MDstr}: {MDstr: string}) {
    return (
        // @ts-expect-error
        <Markdown components={components} remarkPlugins={[remarkGfm]}>
            {MDstr.replace(/\\n/g, '\n')}
        </Markdown>
    )
}

function CustomLink({ href, children }: CustomLinkProps) {
    if (typeof children === 'string') {
        if (children === ':event') {
            return EventEmbed(href)
        }
        if (children === ':jobad') {
            return JobadEmbed(href)
        }
    }

    return (
        <Link
            className='link link--primary hover:underline'
            href={String(href)}
            target='_blank'
            rel='noopener noreferrer'
        >
            {children}
        </Link>
    )
}

function ErrorMessage({ err, title }: ErrorMessageProps) {
    if (!err.error) {
        return 'Unknown error'
    }

    return (
    // @ts-ignore
        <Alert variant='danger'>
            {title}
            <br/>
            {err.status && <p>Status: {err.status}</p>}
            {err.error && <p>Error: {err.error}</p>}
        </Alert>
    )
}


async function EventEmbed(id: number) {
    const event = await getEventRow(id)
    if (typeof event === 'string') {
        <ErrorMessage err={event} title={'Error Fetching Event #' + id} />
    }

    return (
        <div className='my-4 w-full max-w-100 rounded-(--border-radius-large) border-[0.15rem] border-(--color-border-default)'>
            {event
                ? <EventItem event={event} variant='card' highlight={false} />
                : <p>Event not found</p>
            }
        </div>
    )
}

async function JobadEmbed(id: number) {
    const jobad = await getJobRow(id)
    if (typeof jobad === 'string') {
        <ErrorMessage err={jobad} title={'Error Fetching Event #' + id} />
    }
    return (
        <div className='my-4 w-full max-w-100 rounded-(--border-radius-large) border-[0.15rem] border-(--color-border-default)'>
            {jobad
                ? <JobadCard jobad={jobad} disableTags={true} />
                : <p>Job ad not found</p>
            }
        </div>
    )
}
