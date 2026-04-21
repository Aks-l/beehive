import { getActivity } from '@utils/api'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const cookieStore = await cookies()
    const unlocked = cookieStore.get('music_users_unlocked')?.value === 'true'

    if (!unlocked) {
        return NextResponse.json({ error: 'Forbidden' }, {
            status: 403,
            headers: {
                'Cache-Control': 'private, no-store, no-cache, must-revalidate',
            }
        })
    }

    const data = await getActivity()

    return NextResponse.json({
        mostActiveUsers: data.mostActiveUsers,
        mostSkippingUsers: data.mostSkippingUsers,
        currentlyListeningUsers: data.currentlyListening.map(song => song.user_id).filter(Boolean) as string[],
    }, {
        headers: {
            'Cache-Control': 'private, no-store, no-cache, must-revalidate',
        }
    })
}
