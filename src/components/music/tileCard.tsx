import config from '@config'
import Image from 'next/image'
import Link from 'next/link'
import ImageWithPlayer from './imageWithPlayer'
import { useState } from 'react'
import { useVisibility } from 'uibee/hooks'

type TileCardProps = {
    name?: string
    image?: string
    imageHash?: string
    url?: string
    className?: string
    children: React.ReactNode
    discord?: true
    user_id?: string
    song_id?: string
    media_type?: 'track' | 'episode'
    user?: boolean
    start?: string
    end?: string
}

type InnerTileCardProps = {
    children: React.ReactNode
    user_id?: string
    src: string
    song?: MinimalSong
    shouldRenderPlayer?: boolean
}

export default function TileCard({
    name,
    image,
    imageHash,
    url,
    className,
    children,
    discord,
    user_id,
    song_id,
    media_type = 'track',
    start,
    end
}: TileCardProps) {
    const src = discord
        ? `${config.url.discordAvatars}/${user_id}/${imageHash}?size=1024`
        : image ? image : `${config.url.spotifyImage}/${imageHash}`
    const style = `flex items-center gap-4 px-2 rounded-lg bg-[var(--color-text-disabled)]/30
        shadow-none ${className} min-h-[90px] h-[90px] max-h-[90px]
        ${(song_id || user_id || url) && 'transform transition hover:scale-102 hover:z-20 cursor-pointer'}`
    const spotifyUrl = media_type === 'episode'
        ? `${config.url.spotifyEpisode}/${song_id}`
        : `${config.url.spotify}${song_id}`
    const discordUrl = `${config.url.discordUser}${user_id}`
    const [shouldRenderPlayer, setShouldRenderPlayer] = useState(false)
    const { ref } = useVisibility<HTMLAnchorElement>(() => setShouldRenderPlayer(true))

    function handleMouseEnter() {
        setShouldRenderPlayer(true)
    }

    function handleMouseLeave() {
        setShouldRenderPlayer(false)
    }

    if (song_id || user_id || url) {
        const song: MinimalSong = { start, end, song_id, image, name, media_type }
        return (
            <Link
                className={style}
                href={url ?? (song_id ? spotifyUrl : discordUrl)}
                target='_blank'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={ref}
            >
                <InnerTileCard song={song} src={src} children={children} shouldRenderPlayer={shouldRenderPlayer} />
            </Link>
        )
    }

    return (
        <div className={style}>
            <InnerTileCard src={src} children={children} user_id={user_id} />
        </div>
    )
}

function InnerTileCard({ src, children, user_id, song, shouldRenderPlayer }: InnerTileCardProps) {
    return (
        <>
            {song?.song_id
                ? <ImageWithPlayer
                    src={src}
                    song={song}
                    shouldRenderPlayer={shouldRenderPlayer}
                /> : <Image
                    src={src}
                    alt={user_id ?? 'Tile card image'}
                    width={64}
                    height={64}
                    className='rounded-lg object-cover w-16 h-16'
                />}
            <div className='flex flex-col flex-1 min-w-0'>
                {children}
            </div>
        </>
    )
}
