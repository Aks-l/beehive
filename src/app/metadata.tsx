import type { Viewport, Metadata } from 'next'

const siteName = 'Login'
const siteTitle = 'Login - Linjeforeningen for IT'
const siteDescription = 'Linjeforeningen for IT ved NTNU i Gjøvik.'

const metadata: Metadata = {
    metadataBase: new URL('https://login.no'),
    title: {
        default: siteTitle,
        template: '%s | Login',
    },
    keywords: [
        'login', 'linjeforeningen', 'IT', 'NTNU', 'Gjøvik', 'pwned', 'events',
        'arrangementer', 'bedriftspresentasjon', 'sosialt', 'nettverk', 'karriere',
    ],
    authors: [{ name: 'Login - Linjeforeningen for IT', url: 'https://login.no' }],
    description: siteDescription,
    applicationName: siteName,
    creator: 'Login - Linjeforeningen for IT',
    publisher: 'Login - Linjeforeningen for IT',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: '/',
        siteName,
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'Login Logo',
            },
        ],
        locale: 'nb_NO',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    other: {
        'apple-itunes-app': 'app-id=1660125165',
    },
}

export default metadata

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: '#fd8738',
}
