import Card from './card'
import TileMap from './tileMap'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import { Users } from './users'
import { type Dispatch, type SetStateAction, useState } from 'react'
import config from '@config'
import ListensPerDayChart from './listensPerDay'

type MostPlayedProps = {
    lang: Lang
    mostPlayedAlbums: Album[]
    mostPlayedArtists: ArtistPlayed[]
    mostPlayedSongs: CountedSong[]
    mostPlayedEpisodes: Episode[]
    mostActiveUsers: MusicUser[]
    mostSkippingUsers: MusicSkipUser[]
    currentlyListening: CurrentlyListening[]
    activity: SongDay[]
}

function Activity({
    text,
    activity,
    dropdown = false,
    open = true,
    setOpen,
}: {
    text: {
        songs_played: string
        most_played: string
        listens: string
        no_data: string
    }
    activity: SongDay[]
    dropdown?: boolean
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Card
            text={text.songs_played}
            dropdown={dropdown}
            open={open}
            setOpen={setOpen}
            removePadding={true}
        >
            <div className='gap-2 w-full px-4'>
                <ListensPerDayChart data={activity} text={text} />
            </div>
        </Card>
    )
}

export default function MostPlayed({
    lang,
    mostPlayedAlbums,
    mostPlayedArtists,
    mostPlayedSongs,
    mostPlayedEpisodes,
    mostActiveUsers,
    mostSkippingUsers,
    currentlyListening,
    activity
}: MostPlayedProps) {
    const text = (lang === 'no' ? no : en)
    const [openOne, setOpenOne] = useState(true)
    const [openTwo, setOpenTwo] = useState(true)
    const [openThree, setOpenThree] = useState(true)

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-4 w-full justify-items-center'>
            <Activity
                text={text.activity}
                activity={activity}
                dropdown={true}
                open={openOne}
                setOpen={setOpenOne}
            />

            <Users
                text={text.users}
                mostActiveUsers={mostActiveUsers}
                mostSkippingUsers={mostSkippingUsers}
                currentlyListening={currentlyListening}
                dropdown={true}
                open={openOne}
                setOpen={setOpenOne}
            />

            <TileMap
                text={text.most_played_albums}
                items={mostPlayedAlbums}
                getImageHash={a => a.top_song_image}
                getTitle={a => a.album}
                getUrl={a => `${config.url.spotifyAlbum}/${a.album_id}`}
                getFirstLine={a => a.top_song}
                getSecondLine={a => a.artist}
                getCount={a => a.total_listens}
                dropdown={true}
                open={openTwo}
                setOpen={setOpenTwo}
            />

            <TileMap
                text={text.most_played_artists}
                items={mostPlayedArtists}
                getUrl={a => `${config.url.spotifyArtist}/${a.artist_id}`}
                getImageHash={a => a.image}
                getTitle={a => a.artist}
                getFirstLine={a => a.album}
                getSecondLine={a => a.top_song}
                getCount={a => a.listens}
                dropdown={true}
                open={openTwo}
                setOpen={setOpenTwo}
            />

            <TileMap
                text={text.most_played_songs}
                items={mostPlayedSongs}
                getImageHash={a => a.image}
                getUrl={a => `${config.url.spotify}${a.song_id}`}
                getTitle={a => a.name}
                getFirstLine={a => a.album}
                getSecondLine={a => a.artist}
                getCount={a => a.listens}
                dropdown={true}
                open={openThree}
                setOpen={setOpenThree}
            />

            <TileMap
                text={text.most_played_episodes}
                items={mostPlayedEpisodes}
                getImageHash={a => a.image}
                getUrl={a => `${config.url.spotifyEpisode}/${a.id}`}
                getTitle={a => a.name}
                getFirstLine={a => a.show}
                getCount={a => a.listens}
                dropdown={true}
                open={openThree}
                setOpen={setOpenThree}
            />
        </div>
    )
}
