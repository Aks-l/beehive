import { normalizeLang } from '@utils/lang'

process.env.TZ = 'Europe/Oslo'

type KeyStringArray = {
    [key: string]: string[]
}

// returns true if more time has passed than the limit(ms)
export function isTimeElapsed(dateTime: number, limit: number) {
    const currentTime = new Date().getTime()
    const elapsedTime = currentTime - dateTime

    return elapsedTime > limit
}


// returns true if less than 7 days has passed
export function isNew(dateTime: string) {
    // one week
    const difLim = 7 * 24 * 60 * 60 * 1000
    const dateNow = new Date().getTime()

    return (dateNow - new Date(dateTime).getTime()) < difLim
}

// returns true if now is after start and before end
export function isOngoing(startDate: Date, endDate: Date) {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    return now >= start && now <= end
}


// returns int
// if x days until, return: x
// if x days since, return: -x
export function getOffsetDays(dateTime: Date) {
    const oneDay = 24 * 60 * 60 * 1000
    const now = new Date()

    // set h:m:s:m to 0 in order to compare only date without time
    dateTime.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    return Math.round((dateTime.getTime() - now.getTime()) / oneDay)
}


// return example: "12:00"
export function formatTimeHHMM(dateTime: Date) {
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}


// return examples:
// if less than an hour: "30 minutes ago"
// if same day: "Today, 12:00"
// if one day ago: "Yesterday, 12:00"
// if less than 6 days ago: "Sat, 12:00"
// if current year: "15. sep, 12:00"
// if more than a year diff year: "2020, 15. sep, 12:00"
export function formatPublishedDate(dateTime: Date, lang='en') {
    lang = normalizeLang(lang)

    const now = new Date()
    const minutesAgo = Math.floor((now.getTime() - dateTime.getTime()) / (1000 * 60))

    const nowDay = new Date(now)
    const dtDay = new Date(dateTime)
    nowDay.setHours(0, 0, 0, 0)
    dtDay.setHours(0, 0, 0, 0)

    const oneDay = 24 * 60 * 60 * 1000
    const dayDif = (nowDay.getTime() - dtDay.getTime()) / oneDay

    const timeExpiration: KeyStringArray = {
        en: ['minutes ago'],
        no: ['minutter siden']
    }
    const dayExpration: KeyStringArray = {
        en: ['Today', 'Yesterday'],
        no: ['I dag', 'I går']
    }
    const daysOfWeek: KeyStringArray = {
        en: ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thuday', 'Friday', 'Saturday'],
        no: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    }
    const months: KeyStringArray = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        no: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
    }

    if (minutesAgo < 60) {
        return `${minutesAgo} ${timeExpiration[lang]![0]!}`
    }

    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    if (dateTime.toDateString() === now.toDateString()) {
        return `${dayExpration[lang]![0]!}, ${timeStr}`
    }
    if (dayDif === 1) {
        return `${dayExpration[lang]![1]!}, ${timeStr}`
    }
    if (dayDif < 6) {
        return `${daysOfWeek[lang]![dateTime.getDay()]!}, ${timeStr}`
    }

    const day = dateTime.getDate()
    const month = months[lang]![dateTime.getMonth()]!

    if (dateTime.getFullYear() === now.getFullYear()) {
        return `${day}. ${month}, ${timeStr}`
    }

    return `${dateTime.getFullYear()}, ${day}. ${month}, ${timeStr}`
}


// return example: "Man 15. sep, 15:00"
// if more than a year dif: "2050, Man 15. sep, 15:00"
// if deadline has pased: "Expired"
export function formatDeadlineDate(dateTime: Date, lang='en') {
    lang = normalizeLang(lang)

    const now = new Date()
    if(dateTime < now) {
        return (lang === 'no' ? 'Utløpte: ' : 'Expired: ') + formatPublishedDate(dateTime, lang)
    }

    const dayOfMonth = String(dateTime.getDate())
    const offsetDays = getOffsetDays(new Date(dateTime))

    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    const dayExpration: KeyStringArray = {
        en: ['Today', 'Tomorrow'],
        no: ['I dag', 'I morgen']
    }

    if(offsetDays === 0) return `${dayExpration[lang]![0]!}, ${timeStr}`

    if(offsetDays === 1) return `${dayExpration[lang]![1]!}, ${timeStr}`

    const daysOfWeek: KeyStringArray = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
    }
    const dayOfWeek = daysOfWeek[lang]![dateTime.getDay()]!
    const months: KeyStringArray = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        no: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
    }
    const month = months[lang]![dateTime.getMonth()]!
    const oneYear = 365 * 24 * 60 * 60 * 1000

    // if less than a year dif display: "DoW, DoM. month and time"
    if((Math.abs(now.getTime() - dateTime.getTime())) < oneYear) {
        return `${dayOfWeek} ${dayOfMonth}. ${month}, ${timeStr}`
    }

    // more than a year away display: "year, DoM. month and time"
    const year = String(dateTime.getFullYear())
    return `${year}, ${dayOfMonth}. ${month}, ${timeStr}`
}


// return examples:
// if it starts tomorrow: "Tomorrow"
// if it starts today: "Today"
// if ongoing: "Ongoing"
// if same day but past endDate: "Finished"
// if past endDate yesterday: "Yesterday"
// if past endDate: "x days since"
// if else name of week: "Monday"
// if dif year in the future: "3000"
export function formatEventStatusDate(startDate: Date, endDate: Date, lang='no') {
    lang = normalizeLang(lang)
    const now = new Date()

    if (now > startDate && now < endDate) {
        return lang === 'no' ? 'Pågår' : 'Ongoing'
    }
    if (startDate.getFullYear() < now.getFullYear()) return startDate.getFullYear()

    const daysOfWeek: KeyStringArray = {
        en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        no: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag']
    }
    const dayExpration: KeyStringArray = {
        en: ['Today', 'Tomorrow', 'Yesterday', ' days ago'],
        no: ['I dag', 'I morgen', 'I går', ' dager siden']
    }
    const offsetDays = getOffsetDays(new Date(startDate))

    if (offsetDays === 0) {
        if (now > endDate) return lang === 'no' ? 'Ferdig' : 'Finished'
        return dayExpration[lang]![0]!
    }
    if (offsetDays === 1) {
        return dayExpration[lang]![1]!
    }
    if (offsetDays === -1) {
        return dayExpration[lang]![2]!
    }
    if (offsetDays <= -1) {
        return Math.abs(offsetDays) + dayExpration[lang]![3]!
    }

    return daysOfWeek[lang]![startDate.getDay()]!
}


// return example: "Mon, 12:00"
// if more than a year dif: "2020, Mon, 12:00"
export function formatEventStartDate(dateTime: Date, lang='en') {
    lang = normalizeLang(lang)
    const now = new Date()
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    const daysOfWeek: KeyStringArray = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
    }

    const dayOfWeek = daysOfWeek[lang][dateTime.getDay()]
    const oneYear = 365 * 24 * 60 * 60 * 1000

    if((Math.abs(now.getTime() - dateTime.getTime())) < oneYear) {
        return `${dayOfWeek}, ${timeStr}`
    }

    const year = String(dateTime.getFullYear())
    return `${year}, ${dayOfWeek}, ${timeStr}`
}



// ------- checlist of the datetime utilitys we need -------

// published at, updated at: formatPublishedDate() [X]

// signup opens/deadline: formatDeadlineDate() [X]
//  - 2024, 15. sep, 12:00
//  - Man, 15. sep, 12:00
//  - Tomorrow, 12:00
//  - Today, 12:00
//  - Closed 15. sep, 12:00

// event exprasion: formatEventStatusDate() [X]
//  - Monday...
//  - Tomorrow, Today
//  - Ongoing
//  - Finished
//  - x days ago

// eventStart/eventEnd: formatTimeHHMM() [X]
//  - 12:00

// eventItem-/eventCard-eventStart: formatEventStart() [x]
//  - Man, 12:00
//  - 2024, Man, 12:00

// other:
//  - getOffestDays() [X]
//  - isElapsed() [X]
