interface FilmProps {
    slug: string;
    name: string;
    originName: string;
    categories: {
        slug: string;
        name: string;
    }[];
    description: string;
    status: "ongoing" | "completed" | "upcoming" | "cancelled";
    currentEpisode: number;
    createdAt: number;
    updatedAt: number;
    totalEpisode: number;
    thumbnail: string;
    poster: string;
    trailer: string;
    subLang: string;
    views: number;
    rating: number;
    year: number;
    duration: number;
    episodes: {
        serverName: string;
        data: {
            slug: string;
            name: string;
            m3u8Link: string;
        }[]
    }[]
}

interface FilmDisplayProps {
    slug: string;
    name: string;
    thumbnail: string;
    poster: string;
    views: number;
    rating: number;
}

interface ExtendedFilmDisplayProps {
    slug: string;
    name: string;
    originName: string;
    categories: {
        slug: string;
        name: string;
    }[];
    description: string;
    currentEpisode: number;
    totalEpisode: number;
    thumbnail: string;
    poster: string;
    views: number;
    rating: number;
    year: number;
    duration: number;
}

interface currentEpisodeProps {
    serverIndex: number;
    episodeIndex: number;
}

export type { FilmProps, FilmDisplayProps, ExtendedFilmDisplayProps, currentEpisodeProps };