import Link from 'next/link'
import type { ReactNode } from 'react'
import clsx from '@utils/clsx'

type ButtonProps = {
    children?: ReactNode
    leadingIcon?: ReactNode
    size?: string
    href: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    target?: string
    active?: boolean
    disabled?: boolean
    trailingIcon?: ReactNode
    className?: string
    variant?: string
}

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    leadingIcon,
    trailingIcon,
    disabled = false,
    className = '',
    active = false,
    target = '_blank',
    onClick,
    href,
    ...props
}: ButtonProps) {
    const iconOnly = (leadingIcon || trailingIcon) && !children

    const baseClassName = clsx(
        'inline-flex items-center justify-center font-medium',
        'no-underline leading-none transition-all duration-200 ease-in'
    )

    const variantClassName = {
        primary: clsx(
            'bg-(--color-btn-primary-bg) text-(--color-btn-primary-text)',
            '[&_svg]:fill-(--color-btn-primary-text) [&_i]:text-(--color-btn-primary-text)',
            active ? 'bg-(--color-btn-primary-bg-active)' : 'hover:brightness-95'
        ),
        secondary: clsx(
            'bg-(--color-btn-secondary-bg) text-(--color-text-main)',
            '[&_svg]:fill-(--color-text-main) [&_i]:text-(--color-text-main)',
            active ? 'bg-(--color-btn-secondary-bg-active)' : 'hover:brightness-95'
        ),
        'primary-outlined': clsx(
            'border-[0.13rem] border-(--color-btn-primary-outlined) bg-transparent',
            'text-(--color-btn-primary-outlined)',
            '[&_svg]:fill-(--color-btn-primary-outlined)',
            '[&_i]:text-(--color-btn-primary-outlined)',
            active
                ? clsx(
                    'bg-(--color-btn-primary-bg) text-(--color-btn-primary-text)',
                    '[&_svg]:fill-(--color-btn-primary-text)',
                    '[&_i]:text-(--color-btn-primary-text)'
                )
                : clsx(
                    'hover:bg-(--color-btn-primary-bg)',
                    'hover:text-(--color-btn-primary-text)',
                    'hover:[&_svg]:fill-(--color-btn-primary-text)',
                    'hover:[&_i]:text-(--color-btn-primary-text)'
                )
        ),
        'secondary-outlined': clsx(
            'border-[0.13rem] border-(--color-btn-secondary-outlined) bg-transparent',
            'text-(--color-text-main) [&_svg]:fill-(--color-text-main) [&_i]:text-(--color-text-main)',
            active
                ? clsx(
                    'text-(--color-btn-primary-outlined)',
                    '[&_svg]:fill-(--color-btn-primary-outlined)',
                    '[&_i]:text-(--color-btn-primary-outlined)'
                )
                : 'hover:bg-(--color-btn-secondary-outlined)'
        ),
        ghost: clsx(
            'bg-transparent text-(--color-text-main) [&_svg]:fill-(--color-text-main) [&_i]:text-(--color-text-main)',
            active
                ? clsx(
                    'text-(--color-btn-primary-outlined)',
                    '[&_svg]:fill-(--color-btn-primary-outlined)',
                    '[&_i]:text-(--color-btn-primary-outlined)'
                )
                : 'hover:bg-(--color-btn-secondary-outlined)'
        ),
        danger: clsx(
            'bg-(--color-btn-danger-bg) text-(--color-btn-danger-text)',
            '[&_svg]:fill-(--color-btn-danger-text) [&_i]:text-(--color-btn-danger-text)',
            active ? 'bg-(--color-btn-danger-bg-active)' : 'hover:brightness-95'
        )
    }[variant] || 'bg-(--color-btn-primary-bg) text-(--color-btn-primary-text)'

    const sizeClassName = {
        small: 'rounded-(--border-radius-small) px-4 py-[0.35rem] text-sm leading-[1.4rem]',
        medium: 'rounded-(--border-radius-small) px-[1.2rem] py-2 text-base leading-6',
        large: 'rounded-(--border-radius) px-[1.4rem] py-[0.7rem] text-lg leading-[1.6rem]',
        xl: 'rounded-(--border-radius-large) px-8 py-4 text-[1.3rem] leading-[1.6rem]'
    }[size] || 'rounded-(--border-radius-small) px-[1.2rem] py-2 text-base leading-6'

    const outlinedPaddingClassName = (variant === 'primary-outlined' || variant === 'secondary-outlined')
        ? {
            small: 'px-[0.9rem] py-[0.22rem]',
            medium: 'px-4 py-[0.37rem]',
            large: 'px-[1.3rem] py-[0.57rem]',
            xl: 'px-[1.9rem] py-[0.83rem]'
        }[size] || ''
        : ''

    const iconOnlyClassName = iconOnly
        ? {
            small:
                (variant === 'primary-outlined' || variant === 'secondary-outlined')
                    ? 'p-[0.22rem]'
                    : 'p-[0.35rem]',
            medium:
                (variant === 'primary-outlined' || variant === 'secondary-outlined')
                    ? 'p-[0.37rem]'
                    : 'p-2',
            large:
                (variant === 'primary-outlined' || variant === 'secondary-outlined')
                    ? 'p-[0.57rem]'
                    : 'p-[0.7rem]',
            xl:
                (variant === 'primary-outlined' || variant === 'secondary-outlined')
                    ? 'p-[0.83rem]'
                    : 'p-4'
        }[size] || ''
        : ''

    const iconClassName = {
        small: '[&_i]:text-[1.4rem] [&_i]:leading-[1.4rem]',
        medium: '[&_i]:text-2xl [&_i]:leading-6',
        large: '[&_i]:text-[1.6rem] [&_i]:leading-[1.6rem]',
        xl: '[&_i]:text-[1.7rem] [&_i]:leading-[1.6rem]'
    }[size] || '[&_i]:text-2xl [&_i]:leading-6'

    const content = (
        <>
            {leadingIcon &&
                <span className={clsx('flex items-center justify-center', !iconOnly && 'mr-2', iconClassName)}>
                    {leadingIcon}
                </span>
            }
            {children && <span>{children}</span>}
            {trailingIcon &&
                <span className={clsx('flex items-center justify-center', !iconOnly && 'ml-2', iconClassName)}>
                    {trailingIcon}
                </span>
            }
        </>
    )

    return (
        <Link
            href={href}
            className={clsx(
                baseClassName,
                variantClassName,
                sizeClassName,
                outlinedPaddingClassName,
                iconOnlyClassName,
                disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
                className
            )}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            onClick={onClick}
            {...props}
        >
            {content}
        </Link>
    )
}
