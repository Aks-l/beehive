import { NextRequest, NextResponse } from 'next/server'
import { normalizeLang } from '@utils/lang'

export async function proxy(req: NextRequest) {
    const theme = req.cookies.get('theme')?.value || 'dark'
    const rawLang = req.cookies.get('lang')?.value
    const lang = normalizeLang(rawLang)
    const pwned = Math.floor(Math.random() * 23)
    const res = NextResponse.next()
    if (rawLang !== lang) {
        res.cookies.set('lang', lang, { path: '/', sameSite: 'lax' })
    }
    res.headers.set('x-theme', theme)
    res.headers.set('x-lang', lang)
    res.headers.set('x-pwned', pwned.toString())
    res.headers.set('x-current-path', req.nextUrl.pathname)
    return res
}
