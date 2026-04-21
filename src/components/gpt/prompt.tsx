import { ArrowUp } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type PromptProps = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    input: string
    chatSession: ChatSession | null
    isActiveClientAvailable: boolean
    setInput: Dispatch<SetStateAction<string>>
    text: AIText
}

export default function Prompt({
    handleSubmit,
    textareaRef,
    input,
    chatSession,
    isActiveClientAvailable,
    setInput,
    text
}: PromptProps) {
    return (
        <div className='px-5 py-4 1000px:px-8'>
            <form
                onSubmit={handleSubmit}
                className='mx-auto flex w-full max-w-5xl items-end
                    rounded-2xl border p-2 bg-(--color-bg-surface)
                    border-(--color-border-default) gap-3 pl-4 pr-2 1000px:rounded-full 1000px:pl-6 1000px:pr-3'
            >
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    disabled={!chatSession || !isActiveClientAvailable || chatSession.isSending}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            event.currentTarget.form?.requestSubmit()
                        }
                    }}
                    placeholder={chatSession && isActiveClientAvailable
                        ? text.askFollowup
                        : text.connectToModel}
                    className='min-h-7.5 w-full resize-none overflow-y-auto bg-transparent outline-none'
                />
                <button
                    type='submit'
                    disabled={
                        !input.trim()
                        || !chatSession
                        || !isActiveClientAvailable
                        || chatSession.isSending
                    }
                    className='rounded-full bg-(--color-primary) p-3
                        text-white transition disabled:cursor-not-allowed
                        disabled:opacity-50'
                >
                    <ArrowUp className='h-4 w-4' />
                </button>
            </form>
        </div>
    )
}
