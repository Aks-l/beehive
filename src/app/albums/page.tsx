import no from '@text/albums/no.json'
import en from '@text/albums/en.json'
import { cookies } from 'next/headers'
import Image from 'next/image'
import config from '@config'
import Link from 'next/link'
import { getAlbums } from '@utils/api'
import Button from '@components/button/button'
import EvntkomLogo from '@components/svg/committeelogos/evntkomLogo'
import { normalizeLang } from '@utils/lang'

type PageProps = {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const currentPage = parseInt(params.page || '1', 10)
    const limit = 6
    const offset = (currentPage - 1)

    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en

    const response = await getAlbums({ limit, offset, sort: 'desc' })
    const albums = typeof response === 'string' ? [] : (response.albums || [])
    const totalCount = typeof response === 'string' ? 0 : (response.total_count || 0)
    const totalPages = Math.ceil(totalCount / limit)

    return (
        <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
            <div className='page-section--normal flex flex-col'>
                <h1 className='heading-1 heading-1--top-left-corner'>
                    {text.title}
                </h1>
                <pre className='p-highlighted'>
                    {text.privacy_notice}
                </pre>
                <div className='flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {albums.map((album: GetAlbumProps, albumIndex: number) => (
                        <Link
                            key={album.id}
                            href={`/albums/${album.id}`}
                            className='hover:bg-(--color-bg-surface) rounded-lg p-6 h-fit'
                        >
                            <div className='relative flex items-center justify-center h-64 mb-2'>
                                {album.images
                                    ? cardStack(Math.min(album.images.length, 3), (index, className) => (
                                        <Image
                                            key={index}
                                            src={`${config.url.cdn}/albums/${album.id}/${album.images[index]}`}
                                            alt={lang === 'no' ? album.name_no : album.name_en}
                                            className={className + ' object-cover bg-(--color-bg-surface-raised)'}
                                            width={280}
                                            height={180}
                                            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                            priority={albumIndex === 0}
                                            loading='eager'
                                            quality={80}
                                        />
                                    ))
                                    : cardStack(3, (index, className) => (
                                        <div
                                            key={index}
                                            className={`${className} flex items-center justify-center w-70 h-45
                                                bg-(--color-bg-surface-raised) ring-2 ring-(--color-bg-surface)/20
                                            `}
                                        >
                                            <div className='w-32 h-32'>
                                                <EvntkomLogo />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='text-center'>
                                <h2 className='text-xl font-semibold mb-2 text-text-main truncate'>
                                    {lang === 'no' ? album.name_no : album.name_en}
                                </h2>
                                <h3 className='text-lg'>
                                    {album.year}
                                </h3>
                                <p>
                                    {album.images ? album.image_count : 0} {lang === 'no' ? text.images : text.images}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages >= 1 && (
                    <div className='flex justify-center items-center gap-2 py-8'>
                        {currentPage > 1 && (
                            <Button
                                href={`/albums?page=${currentPage - 1}`}
                                variant='secondary-outlined'
                                target= '_self'
                                size='medium'
                            >
                                Previous
                            </Button>
                        )}

                        <span className='text-text-main'>
                            Page {currentPage} of {totalPages}
                        </span>

                        {currentPage < totalPages && (
                            <Button
                                href={`/albums?page=${currentPage + 1}`}
                                variant='secondary-outlined'
                                target= '_self'
                                size='medium'
                            >
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function cardStack(count: number, renderItem: (index: number, className: string) => React.ReactNode) {
    const getPositionClasses = (index: number) => {
        const baseClasses = 'absolute aspect-3/2 rounded-lg shadow-2xl transition-all duration-300 '
            + 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        const positionClasses =
            index === 0 ? 'z-30 rotate-0 scale-100' :
                index === 1 ? 'z-20 -rotate-6 scale-95 translate-x-[-55%] translate-y-[-55%]' :
                    'z-10 rotate-6 scale-95 translate-x-[-45%] translate-y-[-45%]'
        return `${baseClasses} ${positionClasses}`
    }

    return Array.from({ length: count }).map((_, index) => renderItem(index, getPositionClasses(index)))
}
