import { MongoClient, WithId } from "mongodb";

import { MONGO_URI } from "./env.js";


const DBClient = new MongoClient(MONGO_URI);

const DB = DBClient.db("MyAnamel");


const DBCategory = DB.collection<{
    slug: string;
    name: string;
}>("categories");

const DBFilm = DB.collection<{
    slug: string;
    name: string;
    originName: string;
    categories: string[];
    description: string;
    status: "ongoing" | "completed" | "upcoming" | "cancelled";
    currentEpisode: number;
    createdAt: Date;
    updatedAt: Date;
    totalEpisode: number;
    thumbnail: string;
    poster: string;
    trailer: string;
    subLang: string;
    views: number;
    rating: number;
    rateCount: number;
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
}>("films");

const DBUser = DB.collection<{
    UUID: string;
    username: string;
    name: string;
    password: string;
    email?: string;

    ip?: string
}>("users");

// const DBSession = DB.collection<{
//     ID: string;
//     UUID?: string;
//     createdAt: Date;
// }>("sessions");

const DBViewedEpisode = DB.collection<{
    UUID: string;
    filmSlug: string;
    serverName: string;
    episodeSlug: string[];
}>("viewedFilms");

const DBFollowingFilm = DB.collection<{
    UUID: string;
    filmSlug: string;
}>("followingFilms");

const DBRatedFilm = DB.collection<{
    UUID: string;
    filmSlug: string;
}>("ratedFilms");

const DBAccessToken = DB.collection<{
    UUID: string;
    token: string;

    createdAt: number;
    expiredAt: number;

    ip?: string;
}>("accessTokens");

const DBBlackListToken = DB.collection<{
    token: string;
}>("blackListTokens");



export { DBCategory, DBFilm, DBUser, DBAccessToken, DBBlackListToken, DBFollowingFilm };