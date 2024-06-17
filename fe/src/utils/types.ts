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
    originName: string;
    thumbnail: string;
    poster: string;
    views: number;
    rating: number;
}

interface ExtendedFilmDisplayProps extends FilmDisplayProps {
    description: string;
    categories: {
        slug: string;
        name: string;
    }[];
    currentEpisode: number;
    totalEpisode: number;
    year: number;
    duration: number;
}

interface currentEpisodeProps {
    serverIndex: number;
    episodeIndex: number;
}

interface CursorPaginationProps {
    cursor: string;
}

interface PagePaginationProps {
    amount: number;
    currentPage: number;
    totalPage: number;
    totalAmount: number;
}

interface BEResponse {
    message: string;
    statusCode: number;
    data: any;
}

interface ErrorProps {
    message?: string;
    statusCode?: number;
}

export type {
    FilmProps,
    FilmDisplayProps,
    ExtendedFilmDisplayProps,
    currentEpisodeProps,
    ErrorProps,
    BEResponse,
    CursorPaginationProps,
    PagePaginationProps
}; 