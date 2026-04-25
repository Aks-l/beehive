'use client'

import { useEffect, useState } from 'react'
import './mazemap.min.css'
import ArrowOutward from '@components/svg/symbols/arrowOutward'
import Pin from '@components/svg/symbols/pin'
import Add from '@components/svg/symbols/add'
import Remove from '@components/svg/symbols/remove'
import { useDarkMode } from 'uibee/hooks'
import Script from 'next/script'
import Alert from '@components/alert/alert'

// eslint-disable-next-line
export default function MazeMapEmbed({ poi, ...props }: any) {
    const defualtHeight = 320
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => setHasMounted(true), [])
    //import Mazemap dynamically to prevent ssr issues
    // eslint-disable-next-line
    const [Mazemap, setMazemap] = useState<any[] | null>(null)
    // eslint-disable-next-line
    const [map, setMap] = useState<any>(null)
    const [room, setRoom] = useState(null)
    const isDarkMode = useDarkMode()

    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [webGLSupported, setWebGLSupported] = useState(true)

    const handleScriptLoad = () => {
        // @ts-ignore
        setMazemap(window.Mazemap)
        setScriptLoaded(true)
    }

    useEffect(() => {
        // @ts-ignore
        if (window.Mazemap && !Mazemap) {
            // @ts-ignore
            setMazemap(window.Mazemap)
            setScriptLoaded(true)
        }
    }, [Mazemap])

    // initialize map only once, poi will probably not change
    useEffect(() => {
        if (!Mazemap || !hasMounted) return

        // Check WebGL support
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl')
        if (!gl) {
            setWebGLSupported(false)
            return
        } else {
            setWebGLSupported(true)
        }

        // @ts-ignore
        const embeddedMazemap = new Mazemap.Map({
            container: 'mazemap',
            campuses: 1,
            center: {
                lng: 10.683431,
                lat: 60.790439,
            },
            zLevel: 1,
            zoom: 17,
            minZoom: 10,
            maxZoom: 20,
            zLevelControl: false,
            scrollZoom: false,
            doubleClickZoom: false,
            dragRotate: false,
            dragPan: true,
            touchZoomRotate: false,
            touchPitch: false,
            pitchWithRotate: false,
            style: isDarkMode === true ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
        })

        embeddedMazemap.on('styleimagemissing', (event: { id: string }) => {
            if (!event?.id || embeddedMazemap.hasImage(event.id)) {
                return
            }

            embeddedMazemap.addImage(event.id, {
                width: 1,
                height: 1,
                data: new Uint8Array([0, 0, 0, 0]),
            })
        })

        embeddedMazemap.on('load', () => {
            // Initialize a Highlighter for POIs
            // Storing the object on the map just makes it easy to access for other things
            // @ts-ignore
            embeddedMazemap.highlighter = new Mazemap.Highlighter(embeddedMazemap, {
                showOutline: true,
                showFill: true,
                outlineColor: '#fd8738',
                fillColor: '#d95d0a',
            })

            // Fetching via Data API
            // @ts-ignore
            // eslint-disable-next-line
            Mazemap.Data.getPoi(poi).then((poi: any) => {
                // @ts-ignore
                const lngLat = Mazemap.Util.getPoiLngLat(poi)
                embeddedMazemap.highlighter.highlight(poi)
                embeddedMazemap.setZLevel(poi.properties.zLevel)

                embeddedMazemap.jumpTo({
                    center: lngLat,
                    zoom: 17,
                })
                // zoom animation on loading, by increesing the zoom
                embeddedMazemap.flyTo({
                    zoom: 18,
                    speed: 0.5,
                })

                // if poi is the lounge, set custom name
                setRoom(poi.properties.title === 'A155.1' ? 'Login Lounge' : poi.properties.title)
            })
        })

        setMap(embeddedMazemap)

        return () => {
            embeddedMazemap.remove()
        }
    }, [Mazemap, hasMounted, poi])

    if (!hasMounted) {
        return (
            <>
                <div
                    style={{
                        height: props.height || defualtHeight,
                    }}
                />
            </>
        )
    }

    function zoomIn() {
        map?.zoomIn()
    }

    function zoomOut() {
        map?.zoomOut()
    }

    return (
        <>
            {!scriptLoaded && (
                <Script
                    src='/vendor/mazemap.min.js'
                    strategy='afterInteractive'
                    onLoad={handleScriptLoad}
                    onError={(error) => console.error('Failed to load Mazemap script:', error)}
                />
            )}
            {!webGLSupported ? (
                <div className='relative' style={{ height: props.height || defualtHeight }}>
                    <div className='flex items-center justify-center h-full p-4'>
                        <Alert variant='warning'>
                            WebGL is required for the map to display. Please enable WebGL in your browser settings.
                        </Alert>
                    </div>
                </div>
            ) : (
                <div className='relative' style={{ height: props.height || defualtHeight }}>
                    <div
                        id='mazemap'
                        className='w-full h-full rounded-lg block border-[.2rem] border-(--color-border-default) mx-auto'
                    >
                        <a
                            href={'https://use.mazemap.com/#v=1&sharepoitype=poi&campusid=1&sharepoi=' + poi}
                            rel='noreferrer noopener'
                            target='_blank'
                            className={
                                'absolute z-5 backdrop-blur-[10px] rounded-(--border-radius) bg-[rgba(40,40,40,0.4)] ' +
                                'p-2 top-2 right-2 hover:bg-[rgba(0,0,0,0.5)] 400px:top-[.8rem] 400px:right-[.8rem]'
                            }
                        >
                            <ArrowOutward className='w-6 h-6 fill-white' />
                        </a>
                        {room && (
                            <div
                                className={
                                    'flex flex-row items-center absolute z-5 backdrop-blur-[10px] rounded-(--border-radius) ' +
                                    'bg-[rgba(40,40,40,0.4)] left-2 top-2 py-2 px-[.9rem] leading-6 ' +
                                    'text-white text-base 400px:left-[.8rem] 400px:top-[.8rem]'
                                }
                            >
                                <Pin className='w-6 h-6 fill-white mt-[-.2rem] mr-[.2rem] ml-[-.4rem]' />
                                {room}
                            </div>
                        )}
                        <div
                            className={
                                'absolute z-5 backdrop-blur-[10px] rounded-(--border-radius) bg-[rgba(40,40,40,0.4)] ' +
                                'right-2 400px:right-[.8rem] bottom-8 flex flex-col'
                            }
                        >
                            <button
                                onClick={zoomIn}
                                className={
                                    '[background:none] outline-none border-0 rounded-t-[.3rem] rounded-b-none ' +
                                    '[border-bottom:.05rem_solid_rgb(100,100,100)] text-2xl text-white cursor-pointer ' +
                                    'p-2 hover:bg-[rgba(0,0,0,0.1)]'
                                }
                            >
                                <Add className='w-6 h-6 fill-white' />
                            </button>
                            <button
                                onClick={zoomOut}
                                className={
                                    '[background:none] outline-none border-0 rounded-b-[.3rem] rounded-t-none ' +
                                    'text-2xl text-white cursor-pointer p-2 hover:bg-[rgba(0,0,0,0.1)]'
                                }
                            >
                                <Remove className='w-6 h-6 fill-white' />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
