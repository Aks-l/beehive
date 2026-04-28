'use client'

import Button from '@components/button/button'
import clsx from '@utils/clsx'
import { useSearchParams, usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type GroupToggleOption = {
    name: string
    text?: ReactNode
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
}

type GroupToggleProps = {
    options: GroupToggleOption[]
    defaultActiveOptionIndex?: number
    size: string
    groupVariant?: string
    buttonVariant?: string
    className?: string
    ariaLabel?: string
}

export default function GroupToggle({
    options,
    defaultActiveOptionIndex = 1,
    size = 'medium',
    groupVariant = 'outlined',
    buttonVariant = 'ghost',
    className = '',
    ariaLabel = 'Toggle group'
}: GroupToggleProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const view = searchParams?.get('view')
    const viewIndex = view == 'grid' ? 0 : view == 'list' ? 1 : defaultActiveOptionIndex
    const activeOptionIndex = viewIndex

    const iconPaddingBySize: Record<string, string> = {
        small: '!px-[0.6rem]',
        medium: '!px-[0.8rem]',
        large: '!px-[1.2rem]',
        xl: '!px-[1.8rem]',
    }

    const groupVariantClass = groupVariant === 'outlined'
        ? 'border-[0.13rem] border-solid border-(--color-btn-secondary-outlined)'
        : ''

    const groupClass = clsx(
        'inline-flex overflow-hidden rounded-(--border-radius)',
        groupVariantClass,
        groupVariant === 'ghost' && 'py-[0.13rem]',
        `group-toggle--${groupVariant}`,
        `group-toggle--${size}`,
        className,
    )

    function setView(view: string) {
        const params = new URLSearchParams(searchParams?.toString())
        params.set('view', view)
        return params.toString()
    }

    return (
        <div
            className={groupClass}
            role='group'
            aria-label={ariaLabel}
        >
            {options.map((option, index) => {
                const isActive = activeOptionIndex === index
                const { text, leadingIcon, trailingIcon } = option
                const isIconOnly = !text && Boolean(leadingIcon || trailingIcon)
                const isFirst = index === 0
                const isLast = index === options.length - 1
                const activeStateClass = isActive
                    ? clsx(
                        'active pointer-events-none',
                        '[&_svg]:fill-(--color-primary)',
                        '[&_svg_*]:fill-(--color-primary)',
                        '[&_i]:text-(--color-primary)',
                        'text-(--color-primary)',
                    )
                    : ''

                const dividerClass = isFirst
                    ? '!border-none'
                    : '!border-solid !border-y-0 !border-r-0 !border-l-[0.13rem] !border-l-(--color-btn-secondary-outlined)'

                const buttonClass = clsx(
                    'group-toggle_button !rounded-none',
                    dividerClass,
                    isIconOnly && 'button--icon-only',
                    isFirst && 'group-toggle_button--first',
                    isLast && 'group-toggle_button--last',
                    groupVariant === 'ghost' && isFirst && '!rounded-l-(--border-radius)',
                    groupVariant === 'ghost' && isLast && '!rounded-r-(--border-radius)',
                    isIconOnly && iconPaddingBySize[size],
                    activeStateClass,
                )

                return (
                    <Button
                        href={pathname + '?' + setView(option.name)}
                        key={index}
                        target='_self'
                        variant={buttonVariant}
                        size={size}
                        className={buttonClass}
                        leadingIcon={leadingIcon}
                        trailingIcon={trailingIcon}
                        aria-pressed={isActive}
                        active={isActive}
                    >
                        {text}
                    </Button>
                )
            })}
        </div>
    )
}
