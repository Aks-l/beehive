import { cookies } from 'next/headers'
import { getActivity } from '@utils/api'
import MusicPreviewClient from './previewClient'
import { normalizeLang } from '@utils/lang'

export default async function MusicPreview() {
    const data = await getActivity()
    const lang = normalizeLang((await cookies()).get('lang')?.value)

    return <MusicPreviewClient test-id='music' initialData={data} lang={lang} />
}
