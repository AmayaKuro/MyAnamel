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
    createdAt: number;
    updatedAt: number;
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

const DBFollowedFilm = DB.collection<{
    username: string;
    filmSlug: string;
}>("followedFilms");

const DBRatedFilm = DB.collection<{
    username: string;
    filmSlug: string;
}>("ratedFilms");



export { DBCategory, DBFilm };