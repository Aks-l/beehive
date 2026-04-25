'use client'
import { useState, type ReactNode } from 'react'
import ChevronRight from '@components/svg/symbols/chevronRight'
import clsx from '@utils/clsx'

export default function DropDownBox({ title, children }: { title: ReactNode, children: ReactNode}) {
    const [isOpen, setOpen] = useState(false)

    function handleClick() {
        setOpen(!isOpen)
    }

    return (
        <div className='shadow-(--container-shadow)'>
            <div
                className={clsx(
                    'flex cursor-pointer justify-between bg-(--color-bg-surface) p-2 pl-4',
                    'text-[1.2rem] transition-colors duration-200 hover:bg-(--color-bg-surface-raised)',
                    'rounded-(--border-radius) 800px:p-4 800px:text-2xl',
                    isOpen && 'rounded-b-none rounded-t-[0.3rem]'
                )}
                // @ts-ignore
                onClick={e => handleClick(e)}
            >
                <div className='flex flex-row gap-2 items-center'>{ title }</div>
                <ChevronRight
                    className={clsx(
                        'block h-9 w-9 fill-(--color-text-main)',
                        'transition-transform duration-300',
                        isOpen && 'rotate-90'
                    )}
                />
            </div>
            <div
                className={clsx(
                    'max-h-0 overflow-hidden bg-(--color-bg-surface) text-base',
                    'transition-all duration-300',
                    isOpen && 'h-auto max-h-400 rounded-b-[0.3rem]'
                )}
            >
                {children}
            </div>
        </div>
    )
}
