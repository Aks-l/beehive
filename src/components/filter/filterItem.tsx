'use client'

import FilterGroup from '@components/filter/filter'
import Button from '@components/button/button'
import List from '@components/svg/symbols/list'
import { useState } from 'react'
import type { FilterDefinition } from './prepFilter'

type FilterItemProps = {
    filterData?: Record<string, FilterDefinition> | null
}

export default function FilterItem({filterData}: FilterItemProps) {

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    function toggleFilter() {
        setIsFilterOpen((prevState) => !prevState)
    }

    return(
        <>
            <Button
                href=''
                variant='secondary-outlined'
                target='_self'
                onClick={toggleFilter}
                trailingIcon={<List className={`w-5 h-5 ${isFilterOpen
                    ? 'fill-(--color-text-primary)'
                    : 'fill-(--color-text-regular)'}`}
                />}
                className={`1000px:hidden ${
                    isFilterOpen ? 'active' : ''
                }`}
            >
                Filter
            </Button>
            <div
                className={`p-6 bg-(--color-bg-surface) 1000px:bg-(--color-bg-body)
                    my-2 rounded-(--border-radius) shadow-(--container-shadow)
                    400px:m-[0.5rem_0] 1000px:p-0 1000px:m-0 1000px:relative
                    1000px:block 1000px:bg-none 1000px:shadow-none 1000px:after:content-['']
                    1000px:after:w-[2.6rem] 1000px:after:h-[2.6rem] 1000px:after:absolute
                    1000px:after:bottom-0 1000px:after:right-0
                    1000px:after:border-(--color-border-default)
                    1000px:after:border-t-0 1000px:after:border-r-[0.7rem]
                    1000px:after:border-b-[0.7rem] 1000px:after:border-l-0
                    1000px:after:transition 1000px:after:duration-100
                    1000px:before:content-[''] 1000px:before:w-[2.6rem]
                    1000px:before:h-[2.6rem] 1000px:before:absolute
                    1000px:before:border-t-[0.7rem] 1000px:before:border-r-[0.7rem]
                    1000px:before:border-b-0 1000px:before:border-l-0
                    1000px:before:border-(--color-border-default)
                    1000px:before:top-0 1000px:before:right-0 1000px:before:transition
                    1000px:before:duration-100 ${isFilterOpen ? 'block' : 'hidden'}`
                }
            >
                {filterData ? (
                    <FilterGroup
                        filters={filterData}
                        close={toggleFilter}
                    />
                ) : (
                    'no filter data'
                )}
            </div>
        </>
    )
}
