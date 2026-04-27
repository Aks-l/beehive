import Tag from './tag'
import no from '@text/tags/no.json'
import en from '@text/tags/en.json'
import { isNew } from '@utils/datetimeFormatter'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

type TagsProps = {
    lang?: Lang
    highlight: boolean,
    timePublish: Date,
    canceled: boolean,
    full: boolean,
    ongoing: boolean
}

export default async function Tags({
    lang: preferredLang,
    highlight,
    timePublish,
    canceled,
    full,
    ongoing
}: TagsProps) {
    const lang = preferredLang ?? normalizeLang((await cookies()).get('lang')?.value)
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
