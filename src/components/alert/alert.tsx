import type { ReactNode } from 'react'
import ErrorSymbol from '@components/svg/symbols/error'
import clsx from '@utils/clsx'

type AlertProps = {
    children: ReactNode
    variant: string
    className?: string
}

// helper functions to get colors to make sure tailwind compiles them
function getIconColor(variant: string): string {
    switch (variant) {
        case 'info':
            return 'fill-(--color-alert-info-icon)'
        case 'success':
            return 'fill-(--color-alert-success-icon)'
        case 'warning':
            return 'fill-(--color-alert-warning-icon)'
        case 'danger':
            return 'fill-(--color-alert-danger-icon)'
        default:
            return 'fill-(--color-alert-info-icon)'
    }
}

function getBackgroundColor(variant: string): string {
    switch (variant) {
        case 'info':
            return 'bg-(--color-alert-info-bg)'
        case 'success':
            return 'bg-(--color-alert-success-bg)'
        case 'warning':
            return 'bg-(--color-alert-warning-bg)'
        case 'danger':
            return 'bg-(--color-alert-danger-bg)'
        default:
            return 'bg-(--color-alert-info-bg)'
    }
}

function getTextColor(variant: string): string {
    switch (variant) {
        case 'info':
            return 'text-(--color-alert-info-text)'
        case 'success':
            return 'text-(--color-alert-success-text)'
        case 'warning':
            return 'text-(--color-alert-warning-text)'
        case 'danger':
            return 'text-(--color-alert-danger-text)'
        default:
            return 'text-(--color-alert-info-text)'
    }
}

export default function Alert({ children, variant = 'info', className = '' }: AlertProps) {
    return (
        <div
            className={clsx(
                'grid grid-cols-[min-content_auto] items-start gap-2 rounded-lg px-[1em] py-[0.5em] pl-[0.8em]',
                getBackgroundColor(variant),
                className
            )}
        >
            <ErrorSymbol className={`w-8 h-8 ${getIconColor(variant)}`} />
            <div className={clsx('self-center', getTextColor(variant))}>{children}</div>
        </div>
    )
}
