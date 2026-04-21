'use client'

import type { Dispatch, SetStateAction } from 'react'
import { ChevronDown } from 'lucide-react'
import PlayIcon from './playIcon'
import clsx from '@utils/clsx'

type UserText = {
    active: string
    skipping: string
    reveal: string
}

type CardProps<T> = {
    text: string | UserText
    dropdown?: boolean
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
    children: React.ReactNode
    className?: string
    playIcon?: boolean
    smallText?: boolean
    centerText?: boolean
    current?: T
    handleChange?: Dispatch<SetStateAction<T>>
    changeValues?: T[]
    only?: MusicUserCategory
    removePadding?: boolean
    extraPadding?: boolean
}

export default function Card<T>({
    text,
    children,
    className,
    dropdown = false,
    open = true,
    setOpen,
    playIcon = false,
    smallText = false,
    centerText = false,
    current,
    handleChange,
    changeValues,
    only,
    removePadding,
    extraPadding
}: CardProps<T>) {
    const titleStyle = `${smallText
        ? `${changeValues && 'text-xs sm:text-sm'} text-neutral-400 self-center mb-1`
        : `${changeValues && 'text-xs sm:text-base'} font-semibold`} ${centerText && 'text-center w-full'}`
    const secondStyle = `select-none font-semibold text-neutral-400 bg-(--color-music-change)
        px-2 rounded-lg self-center ${changeValues && 'text-xs sm:text-base'}`
    function toggleOpen() {
        if (dropdown && setOpen) {
            setOpen(!open)
        }
    }

    function toggleChange(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) {
        e.stopPropagation()
        if (handleChange && changeValues) {
            handleChange((prev) => prev === changeValues[0] ? changeValues[1]! : changeValues[0]!)
        }
    }

    const display = current === 'listens'
        ? typeof text === 'string' ? text : text.active
        : typeof text === 'string' ? text : text.skipping
    const opposite = current === 'listens'
        ? typeof text === 'string' ? text : text.skipping
        : typeof text === 'string' ? text : text.active

    return (
        <div className={`bg-(--color-bg-surface) rounded-lg w-full ${removePadding ? '' : 'p-4'} ${className}`}>
            <div
                className={clsx(
                    'flex items-center justify-between',
                    dropdown && 'cursor-pointer',
                    removePadding && 'px-4 pt-4',
                    removePadding && open && '-pb-4',
                    removePadding && !open && 'pb-4',
                    extraPadding && 'pb-2'
                )}
                onClick={toggleOpen}
            >
                <div className='flex gap-2 w-full'>
                    {!changeValues && <h1 className={titleStyle}>{typeof text === 'string' ? text : text.reveal}</h1>}
                    {changeValues && current && <h1 className={titleStyle}>
                        {display}
                    </h1>}
                    {changeValues && opposite && !only && <h1 className={secondStyle} onClick={toggleChange}>
                        {opposite}
                    </h1>}
                    {playIcon && <PlayIcon />}
                </div>
                {dropdown && (
                    <ChevronDown
                        className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
                        size={20}
                    />
                )}
            </div>
            <div className={`grid place-items-center overflow-hidden transition-all
                duration-400 ease-in-out ${dropdown ? (open ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0') : ''}`}
            >
                {children}
            </div>
        </div>
    )
}
