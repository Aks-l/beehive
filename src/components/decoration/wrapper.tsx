import React from 'react'

type DecorationType = 'easter' | 'christmas' | 'winter' | 'newYear' | 'valentine' | 'halloween'

type DecorationProps = {
    type: DecorationType
    children: React.ReactNode
}

function isEaster(date: Date = new Date()): boolean {
    const inputYear = date.getFullYear()
    const a = inputYear % 19
    const b = Math.floor(inputYear / 100)
    const c = inputYear % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const n = Math.floor((h + l - 7 * m + 114) / 31)
    const p = ((h + l - 7 * m + 114) % 31) + 1

    const easterDate = new Date(inputYear, n - 1, p)
    const easterStart = new Date(easterDate).setDate(easterDate.getDate() - 14)
    const easterEnd = new Date(easterDate).setDate(easterDate.getDate() + 7)

    return date.getTime() >= easterStart && date.getTime() <= easterEnd
}

function isChristmas(date: Date = new Date()): boolean {
    return date.getMonth() === 11
}

function isWinter(date: Date = new Date()): boolean {
    const month = date.getMonth()
    return month > 10 || month < 2
}

function isValentine(date: Date = new Date()): boolean {
    return date.getMonth() === 1 && date.getDate() === 14
}

function isNewYear(date: Date = new Date()): boolean {
    return (date.getMonth() === 0 && date.getDate() === 1) || (date.getMonth() === 11 && date.getDate() === 31)
}

function isHalloween(date: Date = new Date()): boolean {
    return date.getMonth() === 9 && date.getDate() === 31
}

export function Decoration({ type, children }: DecorationProps) {
    let isVisible = false

    switch (type) {
        case 'easter':
            isVisible = isEaster()
            break
        case 'christmas':
            isVisible = isChristmas()
            break
        case 'winter':
            isVisible = isWinter()
            break
        case 'newYear':
            isVisible = isNewYear()
            break
        case 'valentine':
            isVisible = isValentine()
            break
        case 'halloween':
            isVisible = isHalloween()
            break
    }
    if (isVisible) {
        return children
    } else {
        return null
    }
}
