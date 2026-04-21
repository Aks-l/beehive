import packageInfo from './package.json'

const { env } = process

const cdn = env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.login.no'
const beekeeperApiUrl = env.BEEKEEPER_API_URL ?? 'https://beekeeper.login.no/api'
const beekeeperWsUrl = env.NEXT_PUBLIC_BEEKEEPER_WSS_URL
    ?? beekeeperApiUrl.replace(/^http/, 'ws')

const config = {
    url: {
        workerbee:  env.WORKERBEE_API_URL ?? 'https://workerbee.login.no/api/v2',
        tekkomBot: env.TEKKOM_BOT_API_URL ?? 'https://bot.login.no/api',
        beekeeper: beekeeperApiUrl,
        beekeeper_wss: beekeeperWsUrl,
        cdn,
        exam: 'https://exam.login.no',
        wiki: 'https://wiki.login.no',
        github: 'https://github.com/login-linjeforeningen-for-it',
        gitlab: 'https://gitlab.login.no',
        linkedin: 'https://www.linkedin.com/company/linjeforeningen-login/about',
        mail: 'kontakt@login.no',
        facebook: 'https://facebook.com/LogNTNU',
        instagram: 'https://www.instagram.com/login_linjeforening/',
        norskTipping: 'https://www.norsk-tipping.no/grasrotandelen/din-mottaker/811940372',
        discord: 'https://discord.gg/login-ntnu',
        discordUser: 'https://discord.com/users/',
        spotifyImage: 'https://i.scdn.co/image',
        discordAvatars: 'https://cdn.discordapp.com/avatars',
        spotify: 'https://open.spotify.com/track/',
        spotifyEmbed: 'https://open.spotify.com/embed/track',
        spotifyEpisode: 'https://open.spotify.com/episode',
        spotifyEpisodeEmbed: 'https://open.spotify.com/embed/episode',
        spotifyAlbum: 'https://open.spotify.com/album',
        spotifyArtist: 'https://open.spotify.com/artist',
        main: 'login.no',
        portrait: `${cdn}/img/board/portraits/2026`
    },
    authPath: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        token: '/api/auth/token',
        logout: '/api/auth/logout'
    },
    authentik: {
        clientId: env.AUTHENTIK_CLIENT_ID,
        clientSecret: env.AUTHENTIK_CLIENT_SECRET,
        auth: `${env.AUTHENTIK_URL}/application/o/authorize/`,
        token: `${env.AUTHENTIK_URL}/application/o/token/`,
        userinfo: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
    },
    version: packageInfo.version,
    timeout: 5000
}

export default config
