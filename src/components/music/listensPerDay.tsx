import { useEffect, useRef, useState } from 'react'
import Chart from './chart'
import clsx from '@utils/clsx'

type ListensPerDayProps = {
    data: SongDay[]
    text: {
        songs_played: string
        most_played: string
        listens: string
        no_data: string
    }
}

export default function ListensPerDayChart({ data, text }: ListensPerDayProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [data])

    if (!data || data.length === 0) {
        return <div className='p-4 text-sm text-muted-foreground'>{text.no_data}</div>
    }

    const chartData = data.map((d) => ({
        key: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: d.total_songs_played,
        raw: d,
    }))

    const width = 500
    const height = 160
    const padding = { top: 15, right: 20, bottom: 25, left: 15 }
    const spacing = 22
    const maxCount = Math.max(...chartData.map(d => d.count))
    const minCount = 0
    const days = chartData.length
    const visible = 14
    const dayWidth = width / visible
    const fullWidth = dayWidth * days

    function yScale(count: number) {
        return height - padding.bottom - ((count - minCount)
            / (maxCount - minCount || 1)) * (height - padding.top - padding.bottom)
    }

    function generateYTicks(max: number) {
        if (max <= 0) {
            return [0]
        }

        const ticks = new Set<number>()
        ticks.add(0)
        ticks.add(max)

        const bases = [1, 2.5, 5]
        const magnitude = Math.pow(10, Math.floor(Math.log10(max)))

        for (const base of bases) {
            const step = base * magnitude / 10
            for (let v = step; v < max; v += step) {
                if (v > 0 && v < max) ticks.add(Math.round(v))
            }
        }

        return [...ticks].sort((a, b) => a - b)
    }

    const rawTicks = generateYTicks(maxCount)

    let lastAccepted: number | null = null
    const yTicks = rawTicks.filter((val) => {
        if (lastAccepted === null) {
            lastAccepted = val
            return true
        }

        const distance = Math.abs(yScale(lastAccepted) - yScale(val))
        if (distance >= spacing) {
            lastAccepted = val
            return true
        }

        return false
    })

    const defaultItem = chartData[chartData.length - 1].raw
    const [selected, setSelected] = useState<SongDay | null>(defaultItem)
    const [hover, setHover] = useState<SongDay | null>(null)
    const display = hover ?? selected ?? defaultItem

    return (
        <div className='relative w-full overflow-visible flex flex-col'>
            <div className='flex '>
                {/* Y Labels */}
                <div className='grid pb-2.5 pt-1.75'>
                    {yTicks.reverse().map((val, i) => (
                        <text
                            key={`y-label-${i}`}
                            x={padding.left - 10}
                            y={yScale(val) + 3}
                            textAnchor='end'
                            className='text-[10px] fill-current opacity-70'
                        >
                            {val}
                        </text>
                    ))}
                </div>
                <div
                    ref={scrollRef}
                    className={clsx(
                        'w-full overflow-x-auto overflow-y-hidden',
                        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                    )}
                >
                    <div style={{ width: `${width}px` }}>

                        <svg
                            viewBox={`0 0 ${fullWidth} ${height}`}
                            width={fullWidth}
                            height={height}
                            className='h-auto'
                        >

                            <defs>
                                <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='0%' stopColor='#fd8738DD' stopOpacity='0.35' />
                                    <stop offset='100%' stopColor='#fd8738DD' stopOpacity='0' />
                                </linearGradient>
                            </defs>

                            <Chart
                                chartData={chartData}
                                yScale={yScale}
                                selected={selected}
                                setHover={setHover}
                                setSelected={setSelected}
                                height={height}
                                padding={padding}
                                fullWidth={fullWidth}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Detail panel */}
            <div className='relative rounded-lg p-3 grid gap-2 text-xs bg-(--color-music-change) shadow-sm'>
                {selected && selected !== defaultItem && (
                    <button
                        onClick={() => setSelected(defaultItem)}
                        className='absolute right-2 top-2 text-sm opacity-60 hover:opacity-100 cursor-pointer'
                    >
                        ×
                    </button>
                )}

                <div className='font-semibold text-sm flex gap-1'>
                    <p>{new Date(display.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className='opacity-50'>· {display.total_songs_played} {text.songs_played}</p>
                </div>
                <div className='space-y-1'>
                    <p className='font-semibold text-md'>{text.most_played}</p>
                    <p>{display.listens} {text.listens}</p>
                    <p className='opacity-80'>{display.song} — {display.artist}</p>
                    <p className='opacity-60'>{display.album}</p>
                </div>
            </div>
        </div>
    )
}
