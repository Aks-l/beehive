import Card from './card'
import Marquee from './marquee'
import PlayIcon from './playIcon'
import TileCard from './tileCard'
import clsx from '@utils/clsx'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { Trophy, Users as UsersIcon } from 'lucide-react'
import Loader from '@components/loader/loader'
import useSWR from 'swr'
import Button from '../button/button'
import { MUSIC_USERS_KEY, useMusicUsersPrefetch } from './useMusicUsers'

type UsersProps = {
    text: {
        active: string
        skipping: string
        reveal: string
    }
    mostActiveUsers?: MusicUser[]
    dropdown?: boolean
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
    currentlyListening?: CurrentlyListening[]
    mostSkippingUsers?: MusicSkipUser[]
    only?: MusicUserCategory
    extraPadding?: boolean
}

export function Users({
    text,
    dropdown = false,
    open = true,
    setOpen,
    only,
    extraPadding
}: UsersProps) {
    const musicUserCategories: MusicUserCategory[] = ['listens', 'skips']
    const [category, setCategory] = useState(only ?? 'listens' as MusicUserCategory)
    const [shouldFetch, setShouldFetch] = useState(false)
    const { unlocked, fetchMusicUsers } = useMusicUsersPrefetch()
    const { data: usersData, isValidating } = useSWR(
        shouldFetch && unlocked ? MUSIC_USERS_KEY : null,
        fetchMusicUsers,
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    if (!usersData) {
        return (
            <Card<MusicUserCategory>
                text={text}
                dropdown={dropdown}
                current={category}
                open={open}
                setOpen={setOpen}
                handleChange={setCategory}
                changeValues={musicUserCategories}
                only={only}
                removePadding={true}
                extraPadding={extraPadding}
            >
                <div className='flex justify-center items-center p-8 w-full min-h-75'>
                    {shouldFetch || isValidating ? <Loader /> : (
                        <Button
                            href='#'
                            onClick={(e) => {
                                e.preventDefault()
                                setShouldFetch(true)
                            }}
                            leadingIcon={<UsersIcon />}
                        >
                            {text.reveal}
                        </Button>
                    )}
                </div>
            </Card>
        )
    }

    const items = category === 'listens' ? usersData.mostActiveUsers : usersData.mostSkippingUsers
    const suffix = category === 'listens' ? 'listen' : 'skip'

    return (
        <Card<MusicUserCategory>
            text={text}
            dropdown={dropdown}
            current={category}
            open={open}
            setOpen={setOpen}
            handleChange={setCategory}
            changeValues={musicUserCategories}
            only={only}
            removePadding={true}
            extraPadding={extraPadding}
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full p-4'>
                {items.slice(0, 5).map((item, index) => {
                    const isCurrentlyListening = usersData.currentlyListeningUsers.includes(item.user_id)
                    const count = category === 'listens'
                        ? (item as MusicUser).songs_played
                        : (item as MusicSkipUser).songs_skipped

                    return (
                        <TileCard
                            key={`${index}-${item.user_id}`}
                            imageHash={item.avatar}
                            className={clsx(
                                'hover:scale-102 transition transform',
                                index === 0 && 'md:col-span-2 outline-2 outline-(--color-music-outline) mx-0.5 -outline-offset-2'
                            )}
                            discord={true}
                            user_id={item.user_id}
                            user={true}
                        >
                            <div className='flex w-full justify-between text-neutral-400 items-top'>
                                <div className={clsx('flex gap-2', isCurrentlyListening ? 'max-w-[85%]' : 'max-w-full')}>
                                    <Marquee
                                        className='truncate'
                                        innerClassName='font-semibold text-lg'
                                        text={item.name}
                                    />
                                    {isCurrentlyListening && <PlayIcon noColor />}
                                </div>
                                <Trophy
                                    className={`px-px w-6 ${index === 0
                                        ? 'stroke-(--color-music-outline)'
                                        : index === 1 ? 'stroke-gray-400'
                                            : index === 2 ? 'stroke-yellow-800' : 'hidden'}`}
                                />
                            </div>
                            <div className='text-sm text-neutral-400 truncate mb-6'>
                                {count} {suffix}{count === 1 ? '' : 's'}
                            </div>
                        </TileCard>
                    )
                })}
            </div>
        </Card>
    )
}
