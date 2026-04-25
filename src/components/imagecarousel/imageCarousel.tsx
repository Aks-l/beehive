'use client'
import { useState, useEffect, useRef } from 'react'
import CarouselImage from './carouselImage'
import clsx from '@utils/clsx'

type NavigateButtonProps = {
    side: 'left' | 'right',
    isPaused: boolean,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

type SlideItemProps = {
    image: string
    stateClassName: string
    isActive: boolean
    title: string
    description: string
    isPaused: boolean
}

function NavigationButton({ side, isPaused, onClick }: NavigateButtonProps) {
    const buttonClassName = clsx(
        'absolute h-full cursor-pointer flex items-center z-3 border-0',
        'w-[24vw] 400px:p-[2vw] 600px:w-[30vw] 600px:p-[8vw] 800px:w-[33vw]',
        '1000px:w-[32.5vw] 1000px:p-[8vw] 1200px:w-[50rem]',
        side === 'left'
            ? 'left-0 justify-end bg-[linear-gradient(to_right,var(--color-bg-body,#ffffff)_0%,transparent_100%)] '
                + '1200px:left-1/2 1200px:pr-16 1200px:pl-0 1200px:translate-x-[-71.5rem]'
            : 'right-0 bg-[linear-gradient(to_left,var(--color-bg-body,#ffffff)_0%,transparent_100%)] '
                + '1200px:right-1/2 1200px:pl-16 1200px:pr-0 1200px:translate-x-[71.5rem]'
    )
    const arrowClassName = clsx(
        'block rotate-[-45deg] transition-opacity duration-200',
        isPaused ? 'opacity-100' : 'opacity-0',
        side === 'left'
            ? 'w-[1.8rem] h-[1.8rem] border-t-[0.5rem] border-l-[0.5rem] border-(--color-primary) '
                + '800px:mr-[4vw] 800px:w-12 800px:h-12'
            : 'w-[1.8rem] h-[1.8rem] border-r-[0.5rem] border-b-[0.5rem] border-(--color-primary) '
                + '800px:ml-[4vw] 800px:w-12 800px:h-12'
    )

    return (
        <button
            className={buttonClassName}
            onClick={onClick}
            aria-label={side === 'left' ? 'previous' : 'next'}
        >
            <span className={arrowClassName} aria-hidden='true' />
        </button>
    )
}

function SlideItem({ image, stateClassName, isActive, title, description, isPaused }: SlideItemProps) {
    const slideClassName = clsx(
        'group/slide absolute left-1/2 bg-[rgba(100,100,100,0.3)] rounded-(--border-radius)',
        'will-change-transform',
        'w-[72vw] h-[48vw] ml-[-36vw] 600px:w-[60vw] 600px:h-[40vw] 600px:ml-[-30vw]',
        '800px:w-[54vw] 800px:h-[36vw] 800px:ml-[-27vw] 1000px:w-[48vw] 1000px:h-[32vw]',
        '1000px:ml-[-24vw] 1200px:max-w-[36rem] 1200px:h-96 1200px:ml-[-18rem]',
        stateClassName,
    )
    const slideTransitionStyle = {
        transitionProperty: 'all',
        transitionDuration: isPaused ? '500ms' : '1600ms',
        transitionTimingFunction: 'ease-in-out',
    } as const
    const overlayClassName = clsx(
        'absolute top-0 left-0 w-full h-full flex flex-col justify-end gap-2 rounded-(--border-radius)',
        'bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] opacity-0',
        'transition-opacity duration-400 p-4 600px:p-[1.2rem] 1200px:p-8',
        isActive && 'group-hover/slide:opacity-100 group-focus-within/slide:opacity-100'
    )

    return (
        <div className={slideClassName} style={slideTransitionStyle}>
            <div className={overlayClassName}>
                <div className='600px:border-l-[0.3rem] 600px:border-l-(--color-primary) 600px:pl-4'>
                    <h2 className='text-[1.2rem] font-normal text-white 1200px:text-2xl'>{title}</h2>
                    <p className='text-[rgb(250,250,250)]'>{description}</p>
                </div>
            </div>
            <CarouselImage image={image} title={title} />
        </div>
    )
}

function DotIndicator({ isActive, isPaused }: {isActive: boolean, isPaused: boolean}) {
    const containerWidthClass = isPaused ? 'w-2' : isActive ? 'w-12' : 'w-2'
    const dotClass = isPaused
        ? 'w-2 opacity-0'
        : isActive
            ? 'w-full opacity-100'
            : 'w-2 opacity-0'

    return (
        <div
            className={`${containerWidthClass} h-2 rounded-2xl bg-[rgba(150,150,150,0.3)] transition-[width] duration-[1.2s] delay-300`}
        >
            <div
                className={`${dotClass} h-2 rounded-2xl bg-(--color-text-regular)
                    transition-[width,opacity] duration-[1.5s,0.5s]
                    delay-[1.5s,0s] ease-[linear,ease]`}
            />
        </div>
    )
}

export default function ImageCarousel({ slides }: {slides: []}) {

    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef<null | NodeJS.Timeout>(null)

    useEffect(() => {
        if (!isPaused) {
            startCarousel()
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPaused])

    function startCarousel() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(() => {
            next(true)
        }, 3000)

    }

    const next = (isAutoCarousel = false) => {
        // prevent new transition if there is an ongoing transition
        if (isTransitioning) return

        // automatic transitions are slower
        const transitionDuration = isAutoCarousel ? 1600 : 500
        setIsTransitioning(true)
        setActiveIndex(prevIndex => (prevIndex + 1) % slides.length)

        // let transition complete before allowing navigation
        setTimeout(() => setIsTransitioning(false), transitionDuration)
    }

    function prev() {
        if (isTransitioning) return
        setIsTransitioning(true)
        setActiveIndex(prevIndex => (prevIndex - 1 + slides.length) % slides.length)

        // let transition complete before allowing navigation
        setTimeout(() => setIsTransitioning(false), 500)
    }

    function pause() {
        setIsPaused(true)
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
        }
    }

    function resume() {
        // delay before starting new auto carousel in case there is an ongoing transition
        setTimeout(() => {
            setIsPaused(false)
        }, 500)
    }

    function getSlideState(index: number) {
        if (index === activeIndex) return 'active'
        if (index === (activeIndex - 1 + slides.length) % slides.length) return 'prev'
        if (index === (activeIndex + 1) % slides.length) return 'next'
        if (index === (activeIndex + 2) % slides.length) return 'new-next'
        return 'hide'
    }

    const slideStateClassMap = {
        active: 'z-[3] opacity-100 translate-x-0 scale-100',
        prev: 'z-[2] opacity-70 translate-x-[-70vw] scale-[0.85] 600px:translate-x-[-60vw] 800px:translate-x-[-54vw] '
            + '1000px:translate-x-[-48vw] 1200px:translate-x-[-37rem]',
        next: 'z-[2] opacity-70 translate-x-[70vw] scale-[0.85] 600px:translate-x-[60vw] 800px:translate-x-[54vw] '
            + '1000px:translate-x-[48vw] 1200px:translate-x-[37rem]',
        hide: 'z-[1] opacity-0 pointer-events-none translate-x-[-140vw] scale-[0.85] 600px:translate-x-[-120vw] '
            + '800px:translate-x-[-110vw] 1000px:translate-x-[-100vw] 1200px:translate-x-[-67rem]',
        'new-next': 'z-[1] opacity-0 pointer-events-none translate-x-[140vw] scale-[0.85] 600px:translate-x-[120vw] '
            + '800px:translate-x-[110vw] 1000px:translate-x-[100vw] 1200px:translate-x-[67rem]'
    } as const
    const slidesContainerClassName = clsx(
        'relative isolate overflow-hidden w-[120vw] h-[48vw] mb-6 ml-[-10vw] 600px:h-[40vw] 800px:h-[36vw] 1000px:h-[32vw]',
        '1200px:h-96 1200px:w-full 1200px:max-w-[140rem] 1200px:mx-auto',
        '1200px:mb-8 1200px:overflow-hidden 1200px:flex 1200px:justify-center'
    )

    return (
        <div className='relative overflow-hidden 1200px:flex 1200px:flex-col 1200px:justify-center'>
            <div
                className={slidesContainerClassName}
                onMouseEnter={pause}
                onMouseLeave={resume}
                aria-live='polite'
            >
                <NavigationButton
                    side='left'
                    isPaused={isPaused}
                    onClick={() => prev()}
                />
                {slides.map((slide: {imgSrc: string,title: string,description: string,}, index: number) => {
                    const state = getSlideState(index)
                    return (
                        <SlideItem
                            key={index}
                            image={slide.imgSrc}
                            stateClassName={slideStateClassMap[state]}
                            isActive={state === 'active'}
                            title={slide.title}
                            description={slide.description}
                            isPaused={isPaused}
                        />
                    )
                })}
                <NavigationButton
                    side='right'
                    isPaused={isPaused}
                    onClick={() => next()}
                />
            </div>
            <div className='flex justify-center gap-2 800px:gap-[0.8rem]'>
                {slides.map((_, index: number) => (
                    <DotIndicator
                        key={index}
                        isActive={index === activeIndex}
                        isPaused={isPaused}
                    />
                ))}
            </div>
        </div>
    )
}
