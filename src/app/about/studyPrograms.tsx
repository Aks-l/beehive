'use client'

import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react'
import Link from 'next/link'
import no from '@text/about/no.json'
import en from '@text/about/en.json'
import ArrowOutward from '@components/svg/symbols/arrowOutward'
import ArrowRight from '@components/svg/symbols/arrowRight'
import clsx from '@utils/clsx'

function AccordionItem({
    id,
    title,
    activeAccordionItem,
    setActiveAccordionItem
}: {
    id: string
    title: string
    activeAccordionItem: string
    setActiveAccordionItem: Dispatch<SetStateAction<string>>
}) {
    function handleClick() {
        setActiveAccordionItem(activeAccordionItem === id ? 'none' : id)
    }

    return (
        <li
            onClick={handleClick}
            className='flex cursor-pointer flex-row items-center p-2 text-[1.3rem]
                transition-all duration-200 hover:bg-(--color-bg-surface-raised)
                800px:p-4 800px:text-2xl'
        >
            <ArrowRight
                className={clsx(
                    'ml-[-0.2rem] mr-[0.4rem] h-10 w-10 shrink-0 fill-(--color-text-primary)',
                    'transition-transform duration-300',
                    activeAccordionItem === id && 'rotate-90'
                )}
            />
            {title}
        </li>
    )
}

function AccordionContent({
    id,
    activeAccordionItem,
    children
}: {
    id: string
    activeAccordionItem: string
    children: ReactNode
}) {
    return (
        <div
            className={clsx(
                'max-h-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0,1,0,1)]',
                activeAccordionItem === id && 'h-auto max-h-400 ease-[cubic-bezier(1,0,1,0)]'
            )}
        >
            {children}
        </div>
    )
}

export default function StudyPrograms({ lang }: { lang: Lang }) {
    const [activeAccordionItem, setActiveAccordionItem] = useState('bachelor')
    const text = lang === 'no' ? no : en
    const contentItemClassName = 'list-none px-4 py-2 pl-[3.3rem] text-base 800px:pl-[3.8rem]'


    return(
        <ul className='w-full overflow-hidden rounded-(--border-radius) bg-(--color-bg-surface) shadow-(--container-shadow)'>
            <AccordionItem
                id='bachelor'
                title={'Bachelor'}
                activeAccordionItem={activeAccordionItem}
                setActiveAccordionItem={setActiveAccordionItem}
            />
            <AccordionContent id='bachelor' activeAccordionItem={activeAccordionItem}>
                <li className={contentItemClassName}>
                    <Link
                        href='https://www.ntnu.no/studier/bidata'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.bachelor.computerEngineer}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx('flex flex-row', contentItemClassName)}>
                    <Link
                        href='https://www.ntnu.no/studier/bdigsec'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.bachelor.digsec}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx('flex flex-row', contentItemClassName, 'pb-4')}>
                    <Link
                        href='https://www.ntnu.no/studier/bprog'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.bachelor.prog}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
            </AccordionContent>
            <AccordionItem
                id='master'
                title={'Master'}
                activeAccordionItem={activeAccordionItem}
                setActiveAccordionItem={setActiveAccordionItem}
            />
            <AccordionContent id='master' activeAccordionItem={activeAccordionItem}>
                <li className={clsx('flex flex-row', contentItemClassName)}>

                    <Link
                        href='https://www.ntnu.no/studier/mis'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.master.infosec}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx('flex flex-row', contentItemClassName)}>
                    <Link
                        href='https://www.ntnu.edu/studies/macs'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.master.applied}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx(contentItemClassName, 'pb-4')}>
                    <Link
                        href='https://www.ntnu.no/studier/mscosi'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.master.colorimg}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
            </AccordionContent>
            <AccordionItem
                id='phd'
                title={'Ph.d'}
                activeAccordionItem={activeAccordionItem}
                setActiveAccordionItem={setActiveAccordionItem}
            />
            <AccordionContent id='phd' activeAccordionItem={activeAccordionItem}>
                <li className={clsx('flex flex-row', contentItemClassName)}>
                    <Link
                        href='https://www.ntnu.no/studier/phisct'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.phd.infosec}
                        <ArrowOutward className='max-max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx('flex flex-row', contentItemClassName)}>
                    <Link
                        href='https://www.ntnu.no/studier/phcos'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.phd.data}
                        <ArrowOutward className='max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
                <li className={clsx('flex flex-row', contentItemClassName, 'pb-4')}>
                    <Link
                        href='https://www.ntnu.no/studier/phet'
                        target='_blank'
                        className='flex flex-row items-center gap-2'
                    >
                        {text.phd.tele}
                        <ArrowOutward className='max-max-w-6 w-full h-6 fill-(--color-text-main)'/>
                    </Link>
                </li>
            </AccordionContent>
        </ul>
    )
}
