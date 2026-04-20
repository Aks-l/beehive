'use client'

import { X } from 'lucide-react'

type BubbleText = {
    href: string
    className: string
    fill: string
    stroke: string
    text: string
    x: string
    hide: boolean
    handleHide: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

export default function Bubble({ bubble }: { bubble: BubbleText }) {
    if (bubble.hide) {
        return null
    }

    return (
        <a
            href={bubble.href}
            className={`relative ${bubble.className}`}
        >
            <svg
                viewBox='0 0 24 12'
                className='absolute -top-3 h-3 w-6'
                aria-hidden='true'
            >
                <path
                    d='M12 0 24 12H0Z'
                    fill={bubble.fill}
                    stroke={bubble.stroke}
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                />
                <path
                    d='M12 0 24 12H0Z'
                    fill={bubble.fill}
                />
            </svg>
            <div className='flex justify-between'>
                <span>{bubble.text}</span>
                <X onClick={bubble.handleHide} className={bubble.x} />
            </div>
        </a>
    )
}
