export default function PlayIcon({noColor}: {noColor?: boolean}) {
    const color = noColor ? 'bg-neutral-400' : 'bg-(--color-primary-500)'
    return (
        <div className='flex items-end gap-1 h-5'>
            <div className={`w-1 ${color} animate-[bounce1_1.5s_infinite_ease-in-out]`} />
            <div className={`w-1 ${color} animate-[bounce2_1.6s_infinite_ease-in-out]`} />
            <div className={`w-1 ${color} animate-[bounce3_1.7s_infinite_ease-in-out]`} />
        </div>
    )
}
