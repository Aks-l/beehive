'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import config from '@config'

type AlbumImagesProps = {
    images: string[]
    albumId: number
    albumNameNo: string
    albumNameEn: string
    lang: string
}

export default function AlbumImages({ images, albumId, albumNameNo, albumNameEn, lang }: AlbumImagesProps) {
    const [visibleCount, setVisibleCount] = useState(20)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [showPlaceholder, setShowPlaceholder] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const lightboxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 20, images.length))
                }
            },
            { rootMargin: '200px' }
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => observer.disconnect()
    }, [images.length])

    useEffect(() => {
        if (lightboxIndex === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null)
            if (e.key === 'ArrowLeft') navigate(-1)
            if (e.key === 'ArrowRight') navigate(1)
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [lightboxIndex])

    useEffect(() => {
        if (lightboxIndex !== null && lightboxRef.current) {
            lightboxRef.current.focus()
        }
    }, [lightboxIndex])

    const navigate = useCallback((direction: number) => {
        setLightboxIndex((prev) => {
            if (prev === null) return null
            const next = prev + direction
            if (next < 0) return 0
            if (next >= images.length) return images.length - 1
            return next
        })
    }, [images.length])

    useEffect(() => {
        if (lightboxIndex !== null) {
            setIsImageLoading(true)
            setShowPlaceholder(false)
        }
    }, [lightboxIndex])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isImageLoading) {
            timer = setTimeout(() => setShowPlaceholder(true), 100)
        } else {
            setShowPlaceholder(false)
        }
        return () => clearTimeout(timer)
    }, [isImageLoading])

    function getImageUrl(filename: string) {
        return `${config.url.cdn}/albums/${albumId}/${filename}`
    }

    const visibleImages = images.slice(0, visibleCount)

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {visibleImages.map((img, index) => (
                    <div
                        key={img}
                        className='relative aspect-3/2 cursor-pointer
                            overflow-hidden rounded-lg bg-gray-100
                            hover:opacity-90 transition-opacity'
                        onClick={() => setLightboxIndex(index)}
                    >
                        <div className='absolute inset-0 bg-(--color-bg-surface-raised) animate-pulse' />
                        <Image
                            src={getImageUrl(img)}
                            alt={`${lang === 'no'
                                ? albumNameNo
                                : albumNameEn} - ${index + 1}`}
                            fill
                            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                            className='object-cover'
                            loading='eager'
                            priority={index < 6}
                            quality={80}
                        />
                    </div>
                ))}
            </div>

            {visibleCount < images.length && (
                <div ref={loadMoreRef} className='h-20 w-full flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
            )}

            {lightboxIndex !== null && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm'
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setLightboxIndex(null)
                    }}
                    role='dialog'
                    aria-modal='true'
                    ref={lightboxRef}
                    tabIndex={-1}
                >
                    <div style={{ display: 'none' }}>
                        {lightboxIndex + 1 < images.length && (
                            <Image
                                src={getImageUrl(images[lightboxIndex + 1]!)}
                                alt='preload next'
                                fill
                                sizes='100vw'
                                priority
                                loading='eager'
                            />
                        )}
                        {lightboxIndex - 1 >= 0 && (
                            <Image
                                src={getImageUrl(images[lightboxIndex - 1]!)}
                                alt='preload prev'
                                fill
                                sizes='100vw'
                                priority
                                loading='eager'
                            />
                        )}
                    </div>

                    <button
                        onClick={() => setLightboxIndex(null)}
                        className='absolute top-4 right-4 p-2 text-white/75 hover:text-white transition-colors z-50'
                        aria-label='Close'
                    >
                        <X size={32} />
                    </button>

                    {lightboxIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(-1) }}
                            className='absolute left-4 p-2 text-white/75 hover:text-white transition-colors z-50 hidden md:block'
                            aria-label='Previous image'
                        >
                            <ChevronLeft size={48} />
                        </button>
                    )}

                    <div className='relative w-full h-full max-w-6xl max-h-[90vh] mx-4 flex items-center justify-center'>
                        {showPlaceholder && (
                            <div className='absolute inset-0 bg-(--color-bg-surface-raised) animate-pulse rounded-lg z-10' />
                        )}
                        <Image
                            src={getImageUrl(images[lightboxIndex]!)}
                            alt={`${lang === 'no'
                                ? albumNameNo
                                : albumNameEn} - ${lightboxIndex + 1}`}
                            fill
                            className={`object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                            sizes='100vw'
                            priority
                            loading='eager'
                            onLoad={() => setIsImageLoading(false)}
                        />
                    </div>

                    {lightboxIndex < images.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(1) }}
                            className='absolute right-4 p-2 text-white/75 hover:text-white transition-colors z-50 hidden md:block'
                            aria-label='Next image'
                        >
                            <ChevronRight size={48} />
                        </button>
                    )}

                    {lightboxIndex > 0 && (
                        <div
                            className='absolute inset-y-0 left-0 w-1/4 z-40 md:hidden'
                            onClick={(e) => { e.stopPropagation(); navigate(-1) }}
                        />
                    )}
                    {lightboxIndex < images.length - 1 && (
                        <div
                            className='absolute inset-y-0 right-0 w-1/4 z-40 md:hidden'
                            onClick={(e) => { e.stopPropagation(); navigate(1) }}
                        />
                    )}
                </div>
            )}
        </>
    )
}
