'use client'

import { createGradient, hexToRgba, isValidHex } from '@utils/colorManipulation'
import { getCookie } from 'utilbee/utils'
import { useEffect, useState } from 'react'
import { language } from '../langtoggle/langToggle'
import clsx from '@utils/clsx'

export default function DateTile({
    startDate,
    endDate,
    color,
    varient = 'regular',
    useDayText = false,
    // eslint-disable-next-line
}: any) {
    const [lang, setLang] = useState<Lang>('no')
    const sTime = new Date(startDate)
    const eTime = new Date(endDate)
    const sDate = sTime.getDate()
    const eDate = eTime.getDate()
    const sMonth = sTime.getMonth()
    const eMonth = eTime.getMonth()
    const isOverlay = varient === 'overlay'
    const isWide = sDate !== eDate || sMonth !== eMonth

    useEffect(() => {
        const temp = getCookie('lang')
        setLang(temp === 'en' ? 'en' : 'no')
    }, [language])
    const months: Record<Lang, string[]> = {
        en: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        no: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ],
    }

    const daysOfWeek: Record<Lang, string[]> = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    }

    let background

    if (isValidHex(color)) {
        if (varient === 'regular') {
            background = createGradient(color, 1)
        } else {
            background = hexToRgba(color, 0.75)
        }
    } else {
        background = color
    }

    if (useDayText) {
        return (
            <div
                className={clsx(
                    'flex h-fit w-fit justify-center rounded-(--border-radius)',
                    isOverlay
                        ? 'min-h-14 min-w-14 px-2 py-[0.2rem] backdrop-blur-[6px]'
                        : 'h-[4.7rem] min-w-16 p-2 400px:h-20 400px:min-w-20',
                    isWide && 'pt-[0.7rem] 400px:pt-[0.8rem]'
                )}
                style={{ background: background }}
            >
                <div className='w-fit'>
                    <div
                        className={clsx(
                            'text-white',
                            isOverlay
                                ? 'text-[1.2rem] leading-12'
                                : 'text-[1.3rem] leading-[3.7rem] 400px:text-2xl 400px:leading-16'
                        )}
                    >
                        {daysOfWeek[lang][sTime.getDay()]}.
                    </div>
                </div>
            </div>
        )
    }
    if (sMonth === eMonth) {
        return (
            <div
                className={clsx(
                    'flex h-fit w-fit justify-center rounded-(--border-radius)',
                    isOverlay
                        ? 'min-h-14 min-w-14 px-2 py-[0.2rem] backdrop-blur-[6px]'
                        : 'h-[4.7rem] min-w-16 p-2 400px:h-20 400px:min-w-20',
                    isWide && 'pt-[0.7rem] 400px:pt-[0.8rem]'
                )}
                style={{ background: background }}
            >
                <div className='w-fit'>
                    <div
                        className={clsx(
                            'mx-auto w-max text-center text-white',
                            isOverlay
                                ? 'text-[1.6rem] leading-[1.8rem]'
                                : 'text-[1.9rem] leading-[2.3rem] 400px:text-[2.2rem] 400px:leading-10',
                            isWide && (isOverlay ? 'text-[1.4rem]' : 'text-2xl leading-8')
                        )}
                    >
                        {sDate === eDate ? sDate : sDate + '-' + eDate}
                    </div>
                    <div
                        className={clsx(
                            'translate-y-[-0.1rem] text-center text-white',
                            isOverlay
                                ? 'text-[1.1rem] leading-[1.3rem]'
                                : 'text-[1.1rem] leading-[1.4rem] 400px:text-[1.3rem] 400px:leading-6',
                            isWide && 'text-base leading-[1.3rem]'
                        )}
                    >
                        {months[lang][eMonth]}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div
                className={clsx(
                    'flex h-fit w-fit justify-center rounded-(--border-radius)',
                    isOverlay
                        ? 'min-h-14 min-w-14 px-2 py-[0.2rem] backdrop-blur-[6px]'
                        : 'h-[4.7rem] min-w-16 p-2 400px:h-20 400px:min-w-20',
                    'pt-[0.7rem] 400px:pt-[0.8rem]'
                )}
                style={{ background: background }}
            >
                <div className='w-fit'>
                    <div
                        className={clsx(
                            'mx-auto w-max text-center text-white',
                            isOverlay ? 'text-[1.4rem] leading-[1.8rem]' : 'text-2xl leading-8'
                        )}
                    >
                        {sDate}
                    </div>
                    <div
                        className={clsx(
                            'translate-y-[-0.1rem] text-center text-white text-base leading-[1.3rem]',
                            isOverlay && 'text-base leading-[1.3rem]'
                        )}
                    >
                        {months[lang][sMonth]}
                    </div>
                </div>
                <div className={clsx('text-2xl text-white', isOverlay ? 'leading-[1.8rem]' : 'leading-[2.2rem]')}>
                    -
                </div>
                <div className='w-fit'>
                    <div
                        className={clsx(
                            'mx-auto w-max text-center text-white',
                            isOverlay ? 'text-[1.4rem] leading-[1.8rem]' : 'text-2xl leading-8'
                        )}
                    >
                        {eDate}
                    </div>
                    <div
                        className={clsx(
                            'translate-y-[-0.1rem] text-center text-white text-base leading-[1.3rem]',
                            isOverlay && 'text-base leading-[1.3rem]'
                        )}
                    >
                        {months[lang][eMonth]}
                    </div>
                </div>
            </div>
        )
    }
}
