'use server'

import config from '@config'
import Button from '@components/button/button'
import no from '@text/404/no.json'
import en from '@text/404/en.json'
import Image from 'next/image'
import West from '@components/svg/symbols/west'
import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'

export default async function NotFoundPage() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    return (
        <div className='py-16 px-4 max-w-160 m-auto 800px:flex 800px:items-center 800px:justify-around 800px:max-w-300 800px:gap-8'>
            <div className='block w-full max-w-160 m-auto'>
                <Image
                    src={`${config.url.cdn}/img/pizza404.png`}
                    className='not-block w-full max-w-160 m-auto' alt='Hangry 404'
                    width={1508}
                    height={1200}
                />
            </div>
            <div className='block w-full mt-4 800px:w-fit 800px:m-auto 800px:text-left 800px:pr-4'>
                <h1 className='text-8'>{text.header1}</h1>
                <p className='p-regular'>
                    {text.msg}
                </p>
                <Button href='-1' leadingIcon={<West className='' />}>
                    {text.help}
                </Button>
            </div>
        </div>
    )
}
