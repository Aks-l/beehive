import ArrowRight from '@components/svg/symbols/arrowRight'
import clsx from '@utils/clsx'

type AccordionItemProps = {
    id: string
    title: string
    // eslint-disable-next-line
    activeAccordionItem: any
    // eslint-disable-next-line
    setActiveAccordionItem: any
}

export default function AccordionItem({ id, title, activeAccordionItem, setActiveAccordionItem }: AccordionItemProps) {

    function handleClick() {
        if(activeAccordionItem === id)
            setActiveAccordionItem('none')
        else {
            setActiveAccordionItem(id)
        }
    }

    return (
        <li
            onClick={handleClick}
            className={`
                flex cursor-pointer flex-row items-center p-2 text-[1.3rem]
                transition-all duration-200 hover:bg-(--color-bg-surface-raised)
                800px:p-4 800px:text-2xl
            `}
        >
            <ArrowRight
                className={clsx(
                    'ml-[-0.2rem] mr-[0.4rem] h-10 w-10 shrink-0 fill-(--color-text-primary)',
                    'transition-transform duration-300',
                    activeAccordionItem === id && 'rotate-90'
                )}
            />
            {title}
        </li>
    )
}
