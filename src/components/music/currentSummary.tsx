import PlayIcon from './playIcon'

export default function CurrentSummary({ text, listeners }: { text: string, listeners: number }) {
    return (
        <div className='bg-(--color-bg-surface) rounded-lg w-full h-full p-4'>
            <div className='flex items-center justify-between'>
                <div className='flex gap-2 w-full font-semibold justify-between'>
                    <PlayIcon />
                    {listeners} {text}
                    <PlayIcon />
                </div>
            </div>
        </div>
    )
}
