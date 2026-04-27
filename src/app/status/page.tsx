import { cookies } from 'next/headers'
import { getStatus } from '@utils/api'
import { normalizeLang } from '@utils/lang'
import PageClient from './pageClient'

export default async function page() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const monitoring = await getStatus()

    return <PageClient lang={lang} monitoring={monitoring} />
}
