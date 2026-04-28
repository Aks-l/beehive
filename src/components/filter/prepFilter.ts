export type FilterType = 'check' | 'tag'
export type FilterLabel = Record<Lang, string>

export type FilterOption = {
    id: string
    label: FilterLabel
    count: number
}

export type FilterDefinition = {
    id: string
    label: FilterLabel
    filters: Record<string, FilterOption>
    type: FilterType
    showCount: boolean
}

export type FilterSourceValue = Record<string, unknown>

export default function prepFilter(
    data: unknown,
    id: string,
    label: FilterLabel,
    idKey = 'id',
    getLabel: (value: FilterSourceValue) => FilterLabel,
    countKey = 'count',
    type: FilterType,
    showCount = false
): FilterDefinition {
    const filters: Record<string, FilterOption> = {}

    for (const value of getFilterValues(data)) {
        const optionId = String(value[idKey] ?? '')
        if (!optionId) {
            continue
        }

        filters[optionId] = {
            id: optionId,
            label: getLabel(value),
            count: Number(value[countKey] || 1),
        }
    }

    return {
        id,
        label,
        filters,
        type,
        showCount
    }
}

function getFilterValues(data: unknown): FilterSourceValue[] {
    if (!data || typeof data !== 'object') {
        return []
    }

    return Object.values(data).filter(isFilterSourceValue)
}

function isFilterSourceValue(value: unknown): value is FilterSourceValue {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}
