'use client'

import { getCookie } from 'utilbee'
import { useEffect, useRef, useState } from 'react'
import { mutate } from 'swr'

export const MUSIC_USERS_KEY = '/api/music/users'

type MusicUsersData = {
    mostActiveUsers: MusicUser[]
    mostSkippingUsers: MusicSkipUser[]
    currentlyListeningUsers: string[]
}

async function fetchMusicUsers(): Promise<MusicUsersData | null> {
    const response = await fetch(MUSIC_USERS_KEY, {
        credentials: 'same-origin',
        cache: 'no-store',
    })

    if (response.status === 403) {
        return null
    }

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return await response.json()
}

async function unlockMusicUsers() {
    const response = await fetch('/api/music/users/unlock', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }
}

export function useMusicUsersPrefetch() {
    const [unlocked, setUnlocked] = useState(() => getCookie('music_users_unlocked') === 'true')
    const hasPrefetchedRef = useRef(unlocked)

    useEffect(() => {
        if (unlocked) {
            return
        }

        let cancelled = false

        async function handleHumanInteraction() {
            if (cancelled || hasPrefetchedRef.current) {
                return
            }

            hasPrefetchedRef.current = true

            try {
                await unlockMusicUsers()
                if (cancelled) {
                    return
                }

                setUnlocked(true)
                void mutate(MUSIC_USERS_KEY, fetchMusicUsers(), false)
            } catch (error) {
                hasPrefetchedRef.current = false
                console.error('Failed to unlock music users', error)
            }
        }

        const options: AddEventListenerOptions = { passive: true, once: true }
        window.addEventListener('pointerdown', handleHumanInteraction, options)
        window.addEventListener('touchstart', handleHumanInteraction, options)
        window.addEventListener('keydown', handleHumanInteraction, options)
        window.addEventListener('scroll', handleHumanInteraction, options)

        return () => {
            cancelled = true
            window.removeEventListener('pointerdown', handleHumanInteraction)
            window.removeEventListener('touchstart', handleHumanInteraction)
            window.removeEventListener('keydown', handleHumanInteraction)
            window.removeEventListener('scroll', handleHumanInteraction)
        }
    }, [unlocked])

    return { unlocked, fetchMusicUsers, unlockMusicUsers }
}
