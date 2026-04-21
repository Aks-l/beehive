import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ ok: true }, {
        headers: {
            'Cache-Control': 'private, no-store, no-cache, must-revalidate',
        }
    })

    response.cookies.set('music_users_unlocked', 'true', {
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 10,
    })

    return response
}
