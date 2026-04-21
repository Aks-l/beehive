import React, { useState } from 'react'
import TileMap from './tileMap'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import config from '@config'

type MostLikedProps = {
    lang: Lang
    mostLikedAlbums: LikedAlbum[]
    mostLikedArtists: LikedArtist[]
    mostLikedSongs: LikedSong[]
    mostLikedEpisodes: LikedEpisode[]
    mostSkippedAlbums: SkippedAlbum[]
    mostSkippedArtists: SkippedArtist[]
    mostSkippedSongs: SkippedSong[]
    mostSkippedEpisodes: SkippedEpisode[]
    mostInspiredSongs: InspiredSong[]
    mostInspiredEpisodes: InspiredEpisode[]
}

export default function MostX({
    lang,
    mostLikedAlbums,
    mostLikedArtists,
    mostLikedSongs,
    mostLikedEpisodes,
    mostSkippedAlbums,
    mostSkippedArtists,
    mostSkippedSongs,
    mostSkippedEpisodes,
    mostInspiredSongs,
    mostInspiredEpisodes
}: MostLikedProps) {
    const text = lang === 'no' ? no : en
    const [openOne, setOpenOne] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [openThree, setOpenThree] = useState(false)
    const [openFour, setOpenFour] = useState(false)
    const [openFive, setOpenFive] = useState(false)

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
            <TileMap
                text={text.mostx.most_liked_albums}
                items={mostLikedAlbums}
                getImageHash={a => a.image}
                getUrl={a => `${config.url.spotifyAlbum}/${a.album_id}`}
                getTitle={a => a.album}
                getFirstLine={a => a.artist}
                getCountWithIcons={a => ({
                    likeRatio: Math.round(a.like_ratio * 100),
                    totalListens: a.total_listens,
                    totalSkips: a.total_skips
                })}
                dropdown={true}
                open={openOne}
                setOpen={setOpenOne}
            />

            <TileMap
                text={text.mostx.most_skipped_albums}
                items={mostSkippedAlbums}
                getImageHash={a => a.top_song_image}
                getUrl={a => `${config.url.spotifyAlbum}/${a.album_id}`}
                getTitle={a => a.album}
                getFirstLine={a => a.artist}
                getCount={a => a.skips}
                dropdown={true}
                open={openOne}
                setOpen={setOpenOne}
                skip={true}
            />

            <TileMap
                text={text.mostx.most_liked_artists}
                items={mostLikedArtists}
                getImageHash={a => a.image}
                getUrl={a => `${config.url.spotifyArtist}/${a.artist_id}`}
                getTitle={a => a.artist}
                getCountWithIcons={a => ({
                    likeRatio: Math.round(a.like_ratio * 100),
                    totalListens: a.total_listens,
                    totalSkips: a.total_skips
                })}
                dropdown={true}
                open={openTwo}
                setOpen={setOpenTwo}
            />

            <TileMap
                text={text.mostx.most_skipped_artists}
                items={mostSkippedArtists}
                getImageHash={a => a.image}
                getUrl={a => `${config.url.spotifyArtist}/${a.artist_id}`}
                getTitle={a => a.artist}
                getFirstLine={a => a.album}
                getSecondLine={a => a.top_song}
                getCount={a => a.skips}
                dropdown={true}
                open={openTwo}
                setOpen={setOpenTwo}
                skip={true}
            />

            <TileMap
                text={text.mostx.most_liked_songs}
                items={mostLikedSongs}
                getImageHash={s => s.image}
                getUrl={s => `${config.url.spotify}${s.song_id}`}
                getTitle={s => s.song}
                getFirstLine={s => s.artist}
                getCountWithIcons={s => ({
                    likeRatio: Math.round(s.like_ratio * 100),
                    totalListens: s.listens,
                    totalSkips: s.skips
                })}
                dropdown={true}
                open={openThree}
                setOpen={setOpenThree}
            />

            <TileMap
                text={text.mostx.most_skipped_songs}
                items={mostSkippedSongs}
                getImageHash={s => s.image}
                getUrl={s => `${config.url.spotify}${s.song_id}`}
                getTitle={s => s.song}
                getFirstLine={s => s.album}
                getSecondLine={s => s.artist}
                getCount={s => s.skips}
                dropdown={true}
                open={openThree}
                setOpen={setOpenThree}
                skip={true}
            />

            <TileMap
                text={text.mostx.most_liked_episodes}
                items={mostLikedEpisodes}
                getImageHash={e => e.image}
                getUrl={e => `${config.url.spotifyEpisode}/${e.id}`}
                getTitle={e => e.name}
                getFirstLine={e => e.show}
                getCountWithIcons={e => ({
                    likeRatio: Math.round(e.like_ratio * 100),
                    totalListens: e.listens,
                    totalSkips: e.skips
                })}
                dropdown={true}
                open={openFour}
                setOpen={setOpenFour}
            />

            <TileMap
                text={text.mostx.most_skipped_episodes}
                items={mostSkippedEpisodes}
                getImageHash={e => e.image}
                getUrl={e => `${config.url.spotifyEpisode}/${e.id}`}
                getTitle={e => e.name}
                getFirstLine={e => e.show}
                getCount={e => e.skips}
                dropdown={true}
                open={openFour}
                setOpen={setOpenFour}
                skip={true}
            />

            <TileMap
                text={text.mostx.most_inspired_songs}
                items={mostInspiredSongs}
                getImageHash={s => s.image}
                getUrl={s => `${config.url.spotify}${s.song_id}`}
                getTitle={s => s.song}
                getFirstLine={s => s.album}
                getSecondLine={s => s.artist}
                getCount={s => s.inspired}
                dropdown={true}
                open={openFive}
                setOpen={setOpenFive}
                inspired
            />

            <TileMap
                text={text.mostx.most_inspired_episodes}
                items={mostInspiredEpisodes}
                getImageHash={e => e.image}
                getUrl={e => `${config.url.spotifyEpisode}/${e.id}`}
                getTitle={e => e.name}
                getFirstLine={e => e.show}
                getCount={e => e.inspired}
                dropdown={true}
                open={openFive}
                setOpen={setOpenFive}
                inspired
            />
        </div>
    )
}
