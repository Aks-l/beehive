import clsx from '@utils/clsx'

type CheckboxProps = {
    id: string
    label: string
    count: boolean,
    // eslint-disable-next-line
    checked: any
    // eslint-disable-next-line
    onChange: any
}

export default function Checkbox({ id, label, count = false, checked, onChange }: CheckboxProps) {
    return (
        <label className='group grid w-fit cursor-pointer grid-cols-[max-content_1fr]'>
            <input
                className='peer absolute h-0 w-0 cursor-pointer opacity-0'
                type='checkbox'
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <span
                className={clsx(
                    'relative mr-2 inline-block h-[1.4rem] w-[1.4rem]',
                    'rounded-[0.1rem] border-[0.13rem] border-(--color-checkbox-outline)',
                    'transition-all duration-100 ease-in group-hover:bg-(--color-checkbox-bg-hover)',
                    'peer-checked:border-(--color-primary) peer-checked:bg-(--color-primary)',
                    'peer-focus-visible:ring-[0.1rem] peer-focus-visible:ring-[rgb(0,42,255)]',
                    'after:absolute after:left-1/2 after:top-[45%] after:h-[0.8rem] after:w-[0.4rem]',
                    'after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45',
                    'after:border-r-[0.18rem] after:border-b-[0.18rem] after:border-(--color-text-on-primary)',
                    'after:content-[\'\'] after:opacity-0 peer-checked:after:opacity-100'
                )}
            />
            <div>
                {label}
                {count && <span className='text-(--color-text-discreet)'> ({count})</span>}
            </div>
        </label>
    )
}
