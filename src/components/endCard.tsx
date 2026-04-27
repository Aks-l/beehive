
import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function EndCard({ path }: {path: string}) {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <li className='snap-center max-w-88 800px:w-full 800px:max-w-md w-fit min-w-56 1000px:hidden'>
            <Link
                href={path}
                className='group w-full h-full rounded-(--border-radius)
                    flex justify-center items-center flex-col
                    hover:bg-(--color-bg-surface)'
            >
                <div className='group-hover:shadow-none w-[5.2rem] h-[5.2rem]
                    bg-(--color-bg-surface) rounded-full shadow-(--container-shadow)'
                >
                    <div className='w-[1.8rem] h-[1.8rem] mt-[1.8rem] ml-[1.4rem]
                        border-r-[.35rem] border-b-[.35rem] border-(--color-primary)
                        transform -rotate-45 z-5 transition duration-200'
                    />
                </div>
                <div className='text-[1.3rem] font-medium pt-4'>
                    {text.eventsPreview.seeAll}
                </div>
            </Link>
        </li>
    )
}
