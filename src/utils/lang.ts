export function normalizeLang(value?: string | null): Lang {
    if (!value) {
        return 'no'
    }

    const normalized = value.trim().toLowerCase()

    if (normalized === 'en' || normalized.startsWith('en-')) {
        return 'en'
    }

    if (normalized === 'no' || normalized.startsWith('nb') || normalized.startsWith('nn')) {
        return 'no'
    }

    return 'no'
}
