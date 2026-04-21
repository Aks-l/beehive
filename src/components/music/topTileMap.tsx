import { PlayIcon } from 'lucide-react'
import Card from './card'
import Marquee from './marquee'
import TileCard from './tileCard'
import type { Dispatch, SetStateAction } from 'react'
import config from '@config'

type TopTileMapProps = {
    text: string
    items: (TopXSong | TopXEpisode)[]
    dropdown?: boolean
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
    extraPadding?: boolean
}

export default function TopTileMap({ text, items, dropdown = false, open = true, setOpen, extraPadding }: TopTileMapProps) {
    const removePadding = true

    return (
        <Card
            text={text}
            className='w-full'
            dropdown={dropdown}
            extraPadding={extraPadding}
            removePadding={removePadding}
            open={open}
            setOpen={setOpen}
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 pt-4 w-full p-4'>
                {Array.isArray(items) && items.length > 0 && items.map((item, index) => (
                    <TileCard
                        name={'song' in item ? item.song : item.name}
                        key={index}
                        imageHash={item.image}
                        className={`${index === 0 ? 'md:col-span-2' : ''} w-full`}
                        song_id={'song_id' in item ? item.song_id : undefined}
                        media_type='track'
                        url={'song' in item
                            ? `${config.url.spotify}${item.song_id}`
                            : `${config.url.spotifyEpisode}/${item.id}`}
                    >
                        <div className='flex w-full justify-between text-neutral-400 items-top'>
                            <Marquee
                                className='truncate'
                                innerClassName='font-semibold text-lg'
                                text={'song' in item ? item.song : item.name}
                            />
                            <p className='text-neutral-400 pl-2'>{item.listens}</p>
                            <PlayIcon className='fill-neutral-400 stroke-0 p-0.5 -ml-0.5 pb-1' />
                        </div>
                        <Marquee
                            className='truncate'
                            innerClassName='text-sm text-neutral-500'
                            text={'artist' in item ? item.artist : item.show}
                        />
                        {'song' in item && (
                            <Marquee
                                className='truncate'
                                innerClassName={`text-sm text-neutral-500 ${item.artist === 'Unknown' && 'mb-6'}`}
                                text={item.album}
                            />
                        )}
                    </TileCard>
                ))}
            </div>
        </Card>
    )
}
