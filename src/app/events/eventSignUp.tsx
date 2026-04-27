import Button from '@components/button/button'
import Alert from '@components/alert/alert'
import no from '@text/eventPage/no.json'
import en from '@text/eventPage/en.json'
import EventSignUpLiveCount from './eventSignUpLiveCount'
import { formatDeadlineDate, formatPublishedDate } from '@utils/datetimeFormatter'
import ArrowOutward from '@components/svg/symbols/arrowOutward'
import ConfirmationNumber from '@components/svg/symbols/confirmationNumber'
import DisabledByDefault from '@components/svg/symbols/disabledByDefault'
import ExitToApp from '@components/svg/symbols/exitToApp'

type EventSignUpProps = {
    lang: Lang
    url: string
    full: boolean
    canceled: boolean
    cap: number | null
    signupRelease: Date
    signupDeadline: Date
}

export default async function EventSignUp({
    lang,
    url,
    full,
    canceled = false,
    cap = null,
    signupRelease,
    signupDeadline,
}: EventSignUpProps) {
    const text = lang === 'no' ? no : en
    const now = new Date()
    const isFormsLoginNo = !!url && url.includes('forms.login.no')
    const formName = isFormsLoginNo
        ? url.split('/').filter(Boolean).pop() ?? null
        : null
    let msg = ''
    let reqSignup = true
    let ready = true
    let active = false
    let showBtn = true
    let warning = false

    if (canceled) {
        msg = text.signup.canceled
        showBtn = false
        warning = true
    } else if (url === '' || url === null || url === undefined) {
        reqSignup = false
        showBtn = false
        msg = text.signup.none
    } else if (url === 'TBD') {
        ready = false
        showBtn = false
        msg = text.signup.notReady
    } else if (now > signupDeadline) {
        msg = text.signup.closed + ': ' + formatPublishedDate(signupDeadline, lang)
        warning = true
    } else if (full) {
        msg = text.signup.full
        warning = true
    } else if (now > signupRelease && now < signupDeadline) {
        active = true
    }

    return (
        <div
            className={`mt-[1.8rem] pt-[1.2rem] border-t-[0.2rem] border-solid
                border-(--color-border-default) 800px:relative
                800px:after:content-[""] 800px:after:w-[2.6rem]
                800px:after:h-[2.6rem] 800px:after:absolute
                800px:after:border-(--color-border-default)
                800px:after:bottom-0 800px:after:transition
                800px:after:duration-100 event-signup--${showBtn
            ? '800px:after:left-0 800px:after:border-b-[0.7rem] 800px:after:border-l-[0.7rem] 800px:after:border-solid'
            : `group 800px:pb-12 800px:after:border-r-[0.7rem] 800px:after:border-b-[0.7rem] 800px:after:border-solid
                800px:after:right-0`}`
            }
        >
            <div className='mb-4 text-[1.2rem] font-medium'>{text.signup.title}:</div>

            {!canceled && ready && reqSignup && (
                <div className='grid grid-cols-[min-content_auto] gap-4 my-4 mb-8'>
                    {isFormsLoginNo && formName ? (
                        <EventSignUpLiveCount formName={formName} lang={lang} />
                    ) : cap !== null &&
                        <>
                            <div className='inline-flex text-(--color-text-discreet)'>
                                <ConfirmationNumber
                                    className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                />
                                {text.info.capacity}:
                            </div>
                            <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>{cap}</div>
                        </>
                    }
                    {ready && (
                        <>
                            <div className='inline-flex text-(--color-text-discreet)'>
                                <ExitToApp
                                    className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                />
                                {now < signupRelease
                                    ? text.signup.opens
                                    : text.signup.hasOpened}
                                :
                            </div>
                            <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>
                                {now < signupRelease
                                    ? formatDeadlineDate(signupRelease, lang)
                                    : formatPublishedDate(signupRelease, lang)}
                            </div>
                        </>
                    )}
                    {ready && now < signupDeadline && (
                        <>
                            <div className='inline-flex text-(--color-text-discreet)'>
                                <DisabledByDefault
                                    className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)'
                                />
                                {text.signup.closes}:
                            </div>
                            <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>
                                {formatDeadlineDate(signupDeadline, lang)}
                            </div>
                        </>
                    )}
                </div>
            )}
            {msg && (
                <Alert
                    variant={warning ? 'warning' : 'info'}
                    className='mb-4 400px:w-fit 400px:max-w-80
                        800px:group-valid:m-[0_auto_0_0] 800px:max-w-68
                        800px:w-fit 800px:ml-auto'
                >
                    {msg}
                </Alert>
            )}
            {reqSignup && ready && showBtn && (
                <div className='800px:flex 800px:justify-end'>
                    {/* @ts-ignore */}
                    <Button
                        trailingIcon={
                            <ArrowOutward className='w-6 h-6 fill-white' />
                        }
                        href={url}
                        className='w-full pointer-events-auto cursor-pointer 400px:w-fit 400px:min-w-40'
                        variant='primary'
                        disabled={active ? false : true}
                    >
                        {text.signup.action}
                    </Button>
                </div>
            )}
        </div>
    )
}

// Oversikt:

// Har ikke åpnet
//                   _
// Påmelding:          |
//
// cap:     int
// åpner:   tid
// stenger: tid
//
// |_       [  disab  ]

// Er åpen, if now > realise && now < deadline
//                   _
// Påmelding:          |
//
// cap:     int
// åpnet:   tid
// stenger: tid
//
// |_       [  aktiv  ]

// Krever ingen påmelding, link = ''
//                   _
// Påmelding:          |
//
// Krever ingen
// påmelding
//                   _|

// Åpner tbd, link = 'tbd'
//                   _
// Påmelding:          |
//
// cap: x
//
// Påmeldingen er
// ikke klar
//                   _|

// stengt, if now > deadline
//                   _
// Påmelding:          |
//
// cap:   x
// åpnet: tid
//
// Påmeldingen stengte: [formatPublishedDate()]
//
// |_       [  disab  ]

// fullt, full = true
//                   _
// Påmelding:          |
//
// cap:     x
// åpnet:   tid
// stenger: tid
//
// Påmeldingen er full
//
// |_       [  disab  ]
