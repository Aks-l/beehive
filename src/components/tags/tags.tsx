import type { ReactNode } from 'react'
import no from '@text/tags/no.json'
import en from '@text/tags/en.json'
import { isNew } from '@utils/datetimeFormatter'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'
import clsx from '@utils/clsx'

type TagsProps = {
    highlight: boolean,
    timePublish: Date,
    canceled: boolean,
    full: boolean,
    ongoing: boolean
}

function Tag({ children, variant }: { children: ReactNode, variant: string }) {
    const isHighlight = variant === 'highlight'

    const rootClasses = {
        highlight: clsx(
            'rounded-[10em] p-[0.1em]',
            'in-[.light]:p-0 in-[.light]:border-[0.1em]',
            'in-[.light]:border-(--color-tag-highlight-boder)'
        ),
        danger: 'rounded-[10em] bg-(--color-tag-danger-bg)',
        info: 'rounded-[10em] bg-(--color-tag-info-bg)',
        success: 'rounded-[10em] bg-(--color-tag-success-bg)'
    }[variant] || 'rounded-[10em]'

    const containerClasses = {
        highlight: 'rounded-[10em] bg-(--color-bg-body) in-[.light]:bg-(--color-tag-highlight-bg)',
        danger: 'rounded-[10em] border-[0.1em] border-(--color-tag-danger-border)',
        info: 'rounded-[10em] border-[0.1em] border-(--color-tag-info-border)',
        success: 'rounded-[10em] border-[0.1em] border-(--color-tag-success-border)'
    }[variant] || 'rounded-[10em]'

    const textClasses = {
        highlight: 'bg-clip-text text-transparent',
        danger: 'text-(--color-tag-danger-text)',
        info: 'text-(--color-tag-info-text)',
        success: 'text-(--color-tag-success-text)'
    }[variant] || 'text-(--color-text-main)'

    return (
        <div
            className={clsx('block h-fit w-fit text-[0.7rem] font-medium 800px:text-xs', rootClasses)}
            style={isHighlight ? { background: 'var(--color-tag-highlight-bg)' } : undefined}
        >
            <div className={clsx('rounded-[10em] px-[0.9em] py-[0.2em]', containerClasses)}>
                <div
                    className={textClasses}
                    style={isHighlight
                        ? {
                            background: 'var(--color-tag-highlight-text)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }
                        : undefined}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export default async function Tags({
    highlight,
    timePublish,
    canceled,
    full,
    ongoing
}: TagsProps) {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <>
            {canceled && <Tag variant='danger'>{text.canceled}</Tag>}
            {ongoing && !canceled && <Tag variant='success'>{text.ongoing}</Tag>}
            {highlight && !canceled && <Tag variant='highlight'>{text.highlight}</Tag>}
            {isNew(timePublish.toString()) && <Tag variant='info'>{text.new}</Tag>}
            {full && <Tag variant='danger'>{text.full}</Tag>}
        </>
    )
}
