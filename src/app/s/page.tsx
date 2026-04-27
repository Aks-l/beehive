import { cookies } from 'next/headers'
import PageClient from './pageClient'
import { normalizeEngine } from '@utils/search'

export default async function page() {
    const preferredEngine = normalizeEngine((await cookies()).get('preferredEngine')?.value)
    return <PageClient preferredEngine={preferredEngine} />
}
