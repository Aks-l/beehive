'use client'

import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import Button from '@components/button/button'
import no from '@text/filter/no.json'
import en from '@text/filter/en.json'
import KeyboardArrowUp from '@components/svg/symbols/keyboardArrowUp'
import Replay from '@components/svg/symbols/replay'
import { getCookie } from 'utilbee/utils'
import { language } from '../langtoggle/langToggle'
import { usePathname, useRouter } from 'next/navigation'
import clsx from '@utils/clsx'
import type { FilterDefinition, FilterLabel, FilterOption, FilterType } from './prepFilter'

type FilterGroupProps = {
    filters?: Record<string, FilterDefinition>
    close?: () => void
}

type SelectedFilters = Record<string, Set<string>>

export default function FilterGroup({ filters = {}, close }: FilterGroupProps) {
    const router = useRouter()
    const pathname = usePathname()
    const selectedFilters = useRef<SelectedFilters>({})
    const [ resetTrigger, setResetTrigger ] = useState(false)
    const [lang, setLang] = useState<Lang>('no')
    const [text, setText] = useState(no)

    useEffect(() => {
        const text = lang === 'no' ? no : en
        setText(text)
    }, [lang])

    useEffect(() => {
        const temp = getCookie('lang')
        setLang(temp === 'en' ? 'en' : 'no')
    }, [language])

    function onReset() {
        selectedFilters.current = {}
        setResetTrigger(!resetTrigger)
        apply()
    }

    function onApply(selected: Record<string, string>) {
        const params = new URLSearchParams()

        Object.entries(selected).forEach(([filterGroupItemID, filterGroupItem]) => {
            if (filterGroupItem) {
                params.set(filterGroupItemID, filterGroupItem)
            }
        })

        router.push(pathname+'?'+params.toString())
    }

    function params(){
        const params = new URLSearchParams()
        return params.toString()
    }

    function apply() {
        const selected: Record<string, string> = {}

        Object.entries(selectedFilters.current).forEach(([filterGroupItemID, filterGroupItem]) => {
            const choices = Array.from(filterGroupItem)
            if (choices.length) {
                selected[filterGroupItemID] = choices.join(',')
            }
        })

        onApply(selected)
    }

    function onSelect(filterGroupItemID: string, filterID: string, isSelected: boolean) {
        if (filterGroupItemID in selectedFilters.current) {
            if (!isSelected) {
                selectedFilters.current[filterGroupItemID].delete(filterID)
            } else {
                selectedFilters.current[filterGroupItemID].add(filterID)
            }
        } else if (isSelected) {
            selectedFilters.current[filterGroupItemID] = new Set([filterID])
        }

        apply()
    }

    const filterKeys = Object.entries(filters)

    return (
        <div className='@container/filter-groups flex min-h-20 flex-col gap-y-8'>
            {filterKeys.map(([filterGroupItemID, filterGroupItem]) => {
                const filterOptions = Object.values(filterGroupItem.filters)
                if (!filterOptions.length) {
                    return null
                }

                return (
                    <Filter
                        key={filterGroupItemID}
                        label={filterGroupItem.label}
                        showCount={filterGroupItem.showCount}
                        filter={filterOptions}
                        type={filterGroupItem.type}
                        onSelect={getFilterGroupItemOnSelectWithin(onSelect, filterGroupItemID)}
                        resetTrigger={resetTrigger}
                    />
                )
            })}
            <div className='mt-auto flex justify-between gap-4'>
                <Button
                    href={pathname+'?'+params()}
                    target='_self'
                    variant='secondary-outlined'
                    trailingIcon={<Replay className='h-5 w-5 fill-(--color-text-regular)'/>}
                    onClick={onReset}
                    size='medium'
                    className='w-full 400px:w-fit'
                >
                    {text.reset}
                </Button>
                {close &&
                    <Button
                        href=''
                        target='_self'
                        variant='secondary-outlined'
                        leadingIcon={<KeyboardArrowUp className='h-6 w-6 fill-(--color-text-regular)'/>}
                        onClick={close}
                        size='medium'
                        className='1000px:hidden'
                    />
                }
            </div>
        </div>
    )
}

function getFilterGroupItemOnSelectWithin(
    onSelect: (filterGroupItemID: string, filterID: string, isSelected: boolean) => void,
    filterGroupItemID: string
) {
    return (filterID: string, isSelected: boolean) => {
        onSelect(filterGroupItemID, filterID, isSelected)
    }
}

function getFilterItemOnSelect(onSelect: (filterID: string, isSelected: boolean) => void, filterID: string) {
    return (isSelected: boolean) => {
        onSelect(filterID, isSelected)
    }
}

function CheckTag({
    id,
    label,
    checked,
    onChange
}: {
    id: string
    label: string
    checked: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <label className='group relative w-fit cursor-pointer'>
            <input
                className='peer absolute h-0 w-0 opacity-0'
                type='checkbox'
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <div
                className={clsx(
                    'relative cursor-pointer rounded-[0.2em]',
                    'bg-(--color-checktag-bg) px-[0.9em] py-[0.4em]',
                    'leading-[1.3em] text-(--color-checktag-text) transition-all duration-150',
                    'group-hover:brightness-95 peer-checked:bg-(--color-btn-primary-bg)',
                    'peer-checked:pr-[0.6rem] peer-checked:pl-[1.6rem]',
                    'peer-checked:text-(--color-text-on-primary)',
                    'peer-focus-visible:ring-[0.1rem] peer-focus-visible:ring-[rgb(0,42,255)]',
                    'before:absolute before:left-2 before:top-2',
                    'before:h-[0.7rem] before:w-[0.3rem] before:rotate-45',
                    'before:border-r-[0.18rem] before:border-b-[0.18rem] before:border-white before:content-[\'\']',
                    'before:opacity-0 peer-checked:before:opacity-100'
                )}
            >
                {label}
            </div>
        </label>
    )
}

function CheckBox({
    id,
    label,
    count = false,
    checked,
    onChange
}: {
    id: string
    label: string
    count?: number | false
    checked: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <label className='group grid w-fit cursor-pointer grid-cols-[max-content_1fr]'>
            <input
                className='peer absolute h-0 w-0 cursor-pointer opacity-0'
                type='checkbox'
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <span
                className={clsx(
                    'relative mr-2 inline-block h-[1.4rem] w-[1.4rem]',
                    'rounded-[0.1rem] border-[0.13rem] border-(--color-checkbox-outline)',
                    'transition-all duration-100 ease-in group-hover:bg-(--color-checkbox-bg-hover)',
                    'peer-checked:border-(--color-primary) peer-checked:bg-(--color-primary)',
                    'peer-focus-visible:ring-[0.1rem] peer-focus-visible:ring-[rgb(0,42,255)]',
                    'after:absolute after:left-1/2 after:top-[45%] after:h-[0.8rem] after:w-[0.4rem]',
                    'after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45',
                    'after:border-r-[0.18rem] after:border-b-[0.18rem] after:border-(--color-text-on-primary)',
                    'after:content-[\'\'] after:opacity-0 peer-checked:after:opacity-100'
                )}
            />
            <div>
                {label}
                {count && <span className='text-(--color-text-discreet)'> ({count})</span>}
            </div>
        </label>
    )
}

function Filter({
    label,
    filter,
    showCount,
    onSelect,
    type,
    resetTrigger
}: {
    label: FilterLabel
    filter: FilterOption[]
    showCount: boolean
    onSelect: (filterID: string, isSelected: boolean) => void
    type: FilterType
    resetTrigger: boolean
}) {
    const [lang, setLang] = useState<Lang>('no')
    const itemContainerClassName = type === 'check'
        ? 'mt-4 flex flex-col gap-y-2'
        : 'mt-[.7rem] flex flex-row flex-wrap gap-[.7rem]'

    useEffect(() => {
        const temp = getCookie('lang')
        setLang(temp === 'en' ? 'en' : 'no')
    }, [language])

    return (
        <div className='filter'>
            <div className='text-[.9rem] font-medium tracking-[.15em] text-(--color-text-discreet)'>{ label[lang] }</div>
            <div className={itemContainerClassName}>
                {filter.sort((a, b) => b.count - a.count).map((filterItem, index) => {
                    return (
                        <FilterItem
                            key={`${filterItem.id}-${index}`}
                            filter={filterItem}
                            type={type}
                            showCount={showCount}
                            onSelect={getFilterItemOnSelect(onSelect, filterItem.id)}
                            resetTrigger={resetTrigger}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function FilterItem({
    filter,
    showCount,
    onSelect,
    resetTrigger,
    type
}: {
    filter: FilterOption
    showCount: boolean
    onSelect: (isSelected: boolean) => void
    resetTrigger: boolean
    type: FilterType
}) {
    const [ checked, setChecked ] = useState(false)
    const [lang, setLang] = useState<Lang>('no')

    useEffect(() => {
        setChecked(false)
    }, [resetTrigger])

    useEffect(() => {
        const temp = getCookie('lang')
        setLang(temp === 'en' ? 'en' : 'no')
    }, [language])

    function select(isSelected: boolean) {
        setChecked(isSelected)
        onSelect(isSelected)
    }

    if(type == 'tag') {
        return (
            <CheckTag
                onChange={e => select(e.target.checked)}
                id={filter.label[lang]}
                label={filter.label[lang]}
                checked={checked}
            />
        )
    }
    return (
        <CheckBox
            onChange={e => select(e.target.checked)}
            id={filter.label[lang]}
            label={filter.label[lang]}
            checked={checked}
            count={showCount ? filter.count : false}
        />
    )
}
