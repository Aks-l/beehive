import { cookies, headers } from 'next/headers'
import { normalizeLang } from '@utils/lang'
import PageClient from './pageClient'

export default async function page(){
    const pwned = (await headers()).get('x-pwned')
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    return <PageClient pwnedNumber={Number(pwned)} lang={lang} />
}
