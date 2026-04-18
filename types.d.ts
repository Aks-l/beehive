declare global {
    type time_type = 'default' | 'no_end' | 'whole_day' | 'to_be_determined'
    type location_type = 'mazemap' | 'coords' | 'address' | 'digital'
    type embed_type = 'on' | 'off'

    // Events
    type Event = {
        visible: boolean
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        informational_no: string
        informational_en: string
        time_type: time_type
        time_start: string
        time_end: string
        time_publish: string
        time_signup_release: string | null
        time_signup_deadline: string | null
        canceled: boolean
        digital: boolean
        highlight: boolean
        image_small: string | null
        image_banner: string | null
        link_facebook: string | null
        link_discord: string | null
        link_signup: string | null
        link_stream: string | null
        capacity: number | null
        is_full: boolean
    }

    type GetEventProps = Event & {
        id: number
        category: GetCategoryProps
        location: GetLocationProps | null
        parent_id: number | null
        rule: GetRuleProps | null
        audience: GetAudienceProps | null
        organization: GetOrganizationProps | null
        updated_at: string
        created_at: string
    }

    type GetEventsProps = {
        events: GetEventProps[]
        total_count: number
    }

    // Jobs
    type Job = {
        visible: boolean
        highlight: boolean
        title_no: string
        title_en: string
        cities: string[] | null
        skills: string[] | null
        position_title_no: string
        position_title_en: string
        description_short_no: string
        description_short_en: string
        description_long_no: string
        description_long_en: string
        job_type: GetJobTypeProps
        time_publish: string
        time_expire: string
        banner_image: string | null
        application_url: string | null
    }

    type GetJobProps = Job & {
        id: number
        organization: GetOrganizationProps
        created_at: string
        updated_at: string
    }

    type GetJobsProps = {
        jobs: GetJobProps[]
        total_count: number
    }

    type PostJobProps = Job & {
        organization_id: number
    }

    // Organizations
    type Organization = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        link_homepage: string | null
        link_linkedin: string | null
        link_facebook: string | null
        link_instagram: string | null
        logo: string | null
    }

    type GetOrganizationProps = Organization & {
        id: number
        created_at: string
        updated_at: string
    }

    // Locations
    type Location = {
        name_no: string
        name_en: string
        type: string
        mazemap_campus_id: number | null
        mazemap_poi_id: number | null
        address_street: string | null
        address_postcode: number | null
        city_name: string | null
        coordinate_lat: number | null
        coordinate_lon: number | null
        url: string | null
    }

    type GetLocationProps = Location & {
        id: number
        created_at: string
        updated_at: string
    }

    // Rules
    type Rule = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
    }

    type GetRuleProps = Rule & {
        id: number
        created_at: string
        updated_at: string
    }

    // Audience
    type GetAudienceProps = {
        id: number
        name_no: string
        name_en: string
        created_at: string
        updated_at: string
    }

    // Categories
    type GetCategoryProps = {
        id: number
        name_no: string
        name_en: string
        color: string
        created_at: string
        updated_at: string
    }

    // Job Type
    type GetJobTypeProps = {
        id: number
        name_no: string
        name_en: string
        updated_at: string
        created_at: string
    }

    // Albums
    type AlbumProps = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        year: number
    }

    type GetAlbumProps = AlbumProps & {
        id: number
        event: {
            id: number
            name_no: string
            name_en: string
            time_start: string
            time_end: string
        }
        images: string[]
        image_count: number
        created_at: string
        updated_at: string
    }

    type GetAlbumsProps = {
        albums: GetAlbumProps[]
        total_count: number
    }

    // Alerts
    type GetAlertProps = {
        id: number
        service: string
        page: string
        title_no: string
        title_en: string
        description_no: string
        description_en: string
        updated_at: string
        created_at: string
    }

    type DetailedEventData = {
        id: number
        visible: boolean
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        informational_no: string
        informational_en: string
        time_type: time_type
        time_start: string
        time_end: string
        time_publish: string
        time_signup_release: string
        time_signup_deadline: string
        canceled: boolean
        digital: boolean
        highlight: boolean
        image_small: string
        image_banner: string
        link_facebook: string
        link_discord: string
        link_signup: string
        link_stream: string
        capacity: number | null
        full: boolean
        category: number
        location: number | null
        parent: number | null
        rule: number | null
        updated_at: string
        created_at: string
        deleted_at: string
    }

    type Category = {
        id: number
        color: string
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        updated_at: string
        created_at: string
    }

    type EventLocation = {
        id: number
        name_no: string
        name_en: string
        type: location_type
        mazemap_campus_id: number | null
        mazemap_poi_id: number | null
        address_street: string
        address_postcode: number | null
        city_name: string
        coordinate_lat: number | null
        coordinate_lang: number | null
        url: string
        updated_at: string
        created_at: string
        deleted_at: string
    }

    type Rule = {
        id: number
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        updated_at: string
        created_at: string
        deleted_at: string
    }

    type Organization = {
        shortname: string
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        type: string
        link_homepage: string
        link_linkedin: string
        link_facebook: string
        link_instagram: string
        logo: string
        created_at: string
        updated_at: string
        deleted_at: string
    }

    type Audience = {
        id: number
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        created_at: string
        updated_at: string
        deleted_at: string
    }

    type DetailedAd = {
        id: number
        visible: boolean
        highlight: boolean
        title_no: string
        title_en: string
        position_title_no: string
        position_title_en: string
        description_short_no: string
        description_short_en: string
        description_long_no: string
        description_long_en: string
        job_type: 'full' | 'part' | 'summer' | 'verv'
        time_publish: string
        time_expire: string
        application_deadline: string
        banner_image: string
        organization: number
        application_url: string
        updated_at: string
        created_at: string
        deleted_at: string
        skills: string[] | undefined
        cities: string[] | undefined
    }

    type ColorTransitionClassNameProps = {
        color: string
        transition: boolean
        className: string
    }

    type PromisedPageProps = {
        params: Promise<{ id: number | string }>
    }

    type Lang = 'en' | 'no'

    type Music = {
        stats: MusicStats
        currentlyListening: CurrentlyPlaying[]
        mostPlayedAlbums: Album[]
        mostPlayedArtists: ArtistPlayed[]
        mostPlayedSongs: CountedSong[]
        mostPlayedEpisodes: Episode[]
        mostPlayedSongsPerDay: SongDay[]
        topFiveToday: TopXSong[]
        topFiveYesterday: TopXSong[]
        topFiveThisWeek: TopXSong[]
        topFiveLastWeek: TopXSong[]
        topFiveThisMonth: TopXSong[]
        topFiveEpisodesThisMonth: TopXEpisode[]
        topFiveEpisodesLastMonth: TopXEpisode[]
        topFiveLastMonth: TopXSong[]
        topFiveThisYear: TopXSong[]
        topFiveLastYear: TopXSong[]
        mostActiveUsers: MusicUser[]
        mostSkippingUsers: MusicSkipUser[]
        mostLikedAlbums: LikedAlbum[]
        mostLikedArtists: LikedArtist[]
        mostLikedSongs: LikedSong[]
        mostLikedEpisodes: LikedEpisode[]
        mostSkippedAlbums: SkippedAlbum[]
        mostSkippedArtists: SkippedArtist[]
        mostSkippedSongs: SkippedSong[]
        mostSkippedEpisodes: SkippedEpisode[]
        mostInspiredEpisodes: InspiredEpisode[]
        mostInspiredSongs: InspiredSong[]
    }

    type InspiredEpisode = {
        // incomplete but api endpoint is missing so unknown what other properties will exist
        id: string
        name: string
        show: string
        image: string
        listens: number
        skips: number
        inspired: number
    }

    type InspiredSong = {
        song: string
        artist: string
        album: string
        skips: number
        listens: number
        inspired: number
        id: string
        image: string
        like_ratio: number
    }

    type CurrentlyListening = {
        id: number
        song_id: string
        user_id: string
        start: string
        end: string
        source: string
        skipped: boolean
        timestamp: string
        image: string
        name: string
        artist: string
        album: string
    }

    type ArtistPlayed = {
        artist: string
        artist_id: string
        listens: number
        top_song: string
        album: string
        image: string
        song_id: string
    }

    type Album = {
        album: string
        album_id: string
        artist: string
        total_listens: number
        top_song: string
        top_song_image: string
        song_id: string
    }

    type Episode = {
        name: string
        show: string
        listens: number
        image: string
        id: string
    }

    type CountedSong = {
        name: string
        artist: string
        album: string
        listens: number
        image: string
        id: string
    }

    type SongDay = {
        day: string
        song: string
        artist: string
        album: string
        image: string
        listens: number
        total_songs_played: number
        id: string
    }

    type TopXSong = {
        song: string
        artist: string
        album: string
        listens: string
        image: string
        song_id: string
        start?: string
        end?: string
    }

    type TopXEpisode = {
        name: string
        show: string
        image: string
        id: string
        listens: number
    }

    type MusicUser = {
        name: string
        avatar: string
        user_id: string
        songs_played: number
    }

    type MusicSkipUser = {
        name: string
        avatar: string
        user_id: string
        songs_skipped: number
    }

    type MusicUserCategory = 'listens' | 'skips'

    type LikedAlbum = {
        album: string
        album_id: string
        artist: string
        total_listens: number
        total_skips: number
        like_ratio: number
        image: string
        song_id: string
    }

    type LikedArtist = {
        artist: string
        artist_id: string
        total_listens: number
        total_skips: number
        like_ratio: number
        image: string
        song_id: string
    }

    type LikedSong = {
        song: string
        artist: string
        album: string
        skips: number
        listens: number
        image: string
        like_ratio: number
        song_id: string
    }

    type LikedEpisode = {
        id: string
        name: string
        show: string
        listens: number
        skips: number
        image: string
        like_ratio: number
    }

    type SkippedAlbum = {
        album: string
        album_id: string
        artist: string
        skips: number
        top_song: string
        top_song_image: string
        song_id: string
    }

    type SkippedArtist = {
        artist: string
        artist_id: string
        skips: number
        top_song: string
        album: string
        image: string
        song_id: string
    }

    type SkippedSong = {
        song: string
        artist: string
        album: string
        skips: number
        image: string
        song_id: string
    }

    type SkippedEpisode = {
        name: string
        show: string
        skips: number
        listens: string
        image: string
        id: string
    }

    type MusicStats = {
        avg_seconds: number
        total_minutes: number
        total_minutes_this_year: number
        total_songs: number
    }

    type MusicText = {
        title: string
        intro: string
        average_duration: string
        total_minutes: string
        minutes_this_year: string
        total_songs: string
        most_played_albums: string
        most_played_artists: string
        most_played_songs: string
        currently_playing: string
        users: {
            active: string
            skipping: string
            reveal: string
        }
        mostx: MostX
        topx: TopX
    }

    type MostX = {
        most_liked_albums: string
        most_skipped_albums: string
        most_liked_artists: string
        most_skipped_artists: string
        most_liked_songs: string
        most_skipped_songs: string
    }

    type TopX = {
        intro: string
        today: string
        yesterday: string
        thisWeek: string
        lastWeek: string
        thisMonth: string
        lastMonth: string
        thisYear: string
        lastYear: string
    }

    type MinimalSong = {
        start: string | undefined
        end: string | undefined
        image: string | undefined
        song_id: string | undefined
        name: string | undefined
    }

    type ServiceStatusHuman = 'operational' | 'degraded' | 'down' | 'inactive'

    type StatusStarting = {
        prod: {
            status: {
                number: number
                message: string
                info: string
            },
            services: { name: string, status: ServiceStatusHuman }[]
            meta: ServiceStatusHuman
        }
        dev: {
            status: {
                number: number
                message: string
                info: string
            }
            services: { name: string, status: ServiceStatusHuman }[]
            meta: ServiceStatusHuman
        }
    }

    type StatusDegraded = {
        prod: {
            status: {
                number: number
                message: string
                error: string
            },
            services: { name: string, status: ServiceStatusHuman, issues?: Issue[] }[]
            meta: ServiceStatusHuman
        }
        dev: {
            status: {
                number: number
                message: string
                error: string
            }
            services: { name: string, status: ServiceStatusHuman, issues?: Issue[] }[]
            meta: ServiceStatusHuman
        }
    }

    type StatusOperational = {
        prod: {
            status: {
                number: number
                message: ServiceStatusHuman
            },
            services: { name: string, status: ServiceStatusHuman, issues?: Issue[] }[]
            meta: ServiceStatusHuman
        }
        dev: {
            status: {
                number: number
                message: ServiceStatusHuman
            },
            services: { name: string, status: ServiceStatusHuman, issues?: Issue[] }[]
            meta: ServiceStatusHuman
        }
    }

    type Status = StatusOperational | StatusStarting | StatusDegraded

    type Issue = 'domains' | 'logs' | 'server' | 'pods'

    type EngineKey = 'google' | 'duckduckgo' | 'brave'

    type GPT_Client = {
        name: string
        ram: GPT_RAM[]
        cpu: GPT_CPU[]
        gpu: GPT_GPU[]
        model: GPT_ModelMetrics
    }

    type GPT_RAM = {
        name: string
        load: number
    }

    type GPT_CPU = {
        name: string
        load: number
    }

    type GPT_GPU = {
        name: string
        load: number
    }

    type GPT_ModelStatus = 'idle' | 'preparing' | 'generating' | 'error'

    type GPT_ModelMetrics = {
        conversationId: string | null
        status: GPT_ModelStatus
        currentTokens: number
        maxTokens: number
        promptTokens: number
        generatedTokens: number
        contextTokens: number
        contextMaxTokens: number
        tps: number
        lastUpdated: string | null
        lastError: string | null
    }

    type GPT_ChatRole = 'system' | 'user' | 'assistant'

    type GPT_ChatMessage = {
        id: string
        role: GPT_ChatRole
        content: string
        pending?: boolean
        error?: boolean
        clientName?: string | null
        createdAt?: string
    }

    type ChatConversationSummary = {
        id: string
        title: string
        originalClientName: string
        activeClientName: string
        createdAt: string
        updatedAt: string
        lastMessagePreview: string | null
        lastMessageRole: GPT_ChatRole | null
        messageCount: number
    }

    type StoredConversation = ChatConversationSummary & {
        messages: GPT_ChatMessage[]
    }

    type ChatSession = {
        title: string
        originalClientName: string
        clientName: string
        conversationId: string
        messages: GPT_ChatMessage[]
        isSending: boolean
        metrics: GPT_ModelMetrics
        createdAt: string
        updatedAt: string
    }

    type GptSocketMessage = {
        type?: string
        participants?: number
        client?: GPT_Client
        conversationId?: string
        clientName?: string | null
        messages?: GPT_ChatMessage[]
        delta?: string
        content?: string
        error?: string
        metrics?: GPT_ModelMetrics
    }

    type GPT = {
        activeClient: GPT_Client | null
        chatSession: ChatSession | null
        clients: GPT_Client[]
        closeChat: () => void
        conversations: ChatConversationSummary[]
        createConversation: (client: GPT_Client | string) => Promise<ChatSession | null>
        isConnected: boolean
        isLoadingChat: boolean
        isLoadingConversations: boolean
        loadConversations: () => Promise<void>
        openChat: (client: GPT_Client) => Promise<ChatSession | null>
        participants: number
        restoreChat: (conversationId: string) => Promise<void>
        sendPrompt: (content: string, sessionOverride?: ChatSession | null) => boolean
        switchConversationClient: (conversationId: string, clientName: string) => Promise<ChatSession | null>
    }

    type AIText = {
        newChat: string
        previousChats: string
        loading: string
        noMessages: string
        titleFallback: string
        agent: string
        loadingConversation: string
        notFound: string
        liveConnection: string
        reconnecting: string
        modelUnavailable: string
        handoffDescription: string
        switching: string
        continueOnAnotherModel: string
        notFoundTitle: string
        notFoundDescription: string
        thinking: string
        copy: string
        copied: string
        delete: string
        askFollowup: string
        connectToModel: string
    }

    interface ExtendedNavigator extends Navigator {
        globalPrivacyControl: boolean
    }
}

export { }
