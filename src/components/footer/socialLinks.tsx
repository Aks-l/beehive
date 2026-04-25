import config from '@config'

interface SocialLink {
    name: string
    url: string
    iconClass?: string
    hoverClass?: string
    logoSrc?: string
    logoContainerClass?: string
    logoClass?: string
}

const socialLinks: SocialLink[] = [
    {
        name: 'Discord',
        url: config.url.discord,
        iconClass: 'logfont-discord',
        hoverClass: 'hover:text-[#6571fd]'
    },
    {
        name: 'Instagram',
        url: config.url.instagram,
        iconClass: 'logfont-instagram',
        hoverClass: 'hover:text-transparent'
    },
    {
        name: 'Facebook',
        url: config.url.facebook,
        iconClass: 'logfont-facebook',
        hoverClass: 'hover:text-[#2c87ff]'
    },
    {
        name: 'LinkedIn',
        url: config.url.linkedin,
        iconClass: 'logfont-linkedin',
        hoverClass: 'hover:text-[#1a7bdd]'
    },
    {
        name: 'GitHub',
        url: config.url.github,
        iconClass: 'logfont-github',
        hoverClass: 'hover:text-white'
    },
    {
        name: 'Wiki',
        url: config.url.wiki,
        iconClass: 'logfont-wikijs',
        hoverClass: 'hover:text-[rgb(5,186,243)]'
    },
    {
        name: 'Norsk Tipping',
        url: config.url.norskTipping,
        logoSrc: '/img/Norsk_Tipping.svg',
        logoContainerClass: 'w-6 h-6',
        logoClass: 'w-6 h-6'
    }
]

export default function SocialLinks() {
    const baseIconStyle = 'text-2xl leading-none transition-all duration-200 text-center block text-(--color-text-footer)'

    return (
        <div className='grid justify-between mx-auto mt-20 mb-12 sm:grid-cols-7 grid-cols-3 gap-6 w-fit'>
            {socialLinks.map((link) => (
                <a
                    key={link.name}
                    className='flex items-center justify-center w-8 h-8 mx-auto group'
                    href={link.url}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`Visit our ${link.name} page`}
                    title={link.name}
                >
                    {link.logoSrc ? (
                        <span
                            aria-hidden='true'
                            className={`flex items-center justify-center transition-all duration-200 ${link.logoContainerClass ?? ''} 
                                brightness-0 invert opacity-100 group-hover:brightness-100 group-hover:invert-0`}
                        >
                            <img
                                src={link.logoSrc}
                                alt=''
                                className={`block ${link.logoClass ?? ''}`}
                            />
                        </span>
                    ) : (
                        <i
                            className={`${baseIconStyle} ${link.iconClass ?? ''} ${link.hoverClass ?? ''}
                                ${link.iconClass === 'logfont-instagram'
                            ? 'bg-[linear-gradient(45deg,#fff695_0%,#fff695_5%,#ff5445_45%,#ff37c0_60%,#3d6dff_90%)] bg-clip-text' : ''}`
                            }
                        />
                    )}
                </a>
            ))}
        </div>
    )
}
