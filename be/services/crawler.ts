import dotenv from "dotenv";

import { DBCategory, DBFilm } from "../src/utils/database.js"
import { exit } from "process";


type OPhimMain = {
    status: boolean;
    items: {
        modified: {
            // TODO: retype this sus shit
            time: EpochTimeStamp;
        };
        _id: string;
        name: string;
        slug: string;
        origin_name: string;
        thumb_url: string;
        poster_url: string;
        year: number;
    }[];
    pathImage: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number
        totalPages: number;
    }
}

type OPhimSpecificFilm = {
    status: boolean;
    msg: string;
    movie: {
        created: {
            time: string;
        };
        modified: {
            time: string;
        };
        _id: string;
        name: string;
        slug: string;
        origin_name: string;
        content: string;
        type: string;
        status: "ongoing" | "completed" | "trailer" | "cancelled";
        thumb_url: string;
        poster_url: string;
        is_copyright: boolean;
        sub_docquyen: boolean;
        chieurap: boolean;
        trailer_url: string;
        time: string;
        episode_current: string;
        episode_total: string;
        quality: string;
        lang: string;
        notify: string;
        showtimes: string;
        year: number;
        view: number;
        actor: string[];
        director: string[];
        category: {
            id: string;
            name: string;
            slug: string;
        }[];
        country: {
            id: string;
            name: string;
            slug: string;
        }[];
    };
    episodes: {
        server_name: string;
        server_data: {
            name: string;
            slug: string;
            filename: string;
            link_embed: string;
            link_m3u8: string;
        }[];
    }[];
}


const ophim1 = async () => {
    // dotenv.config();

    // Mark as finished crawling
    let done = false;
    const allCategories = await DBCategory.find({}).toArray();

    for (let i = 1; i <= 8 && done === false; i++) {
        let data = await fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${i}`);
        const main = await data.json() as OPhimMain;

        for (let item of main.items) {
            data = await fetch(`https://ophim1.com/phim/${item.slug}`);
            const film = await data.json() as OPhimSpecificFilm;

            if (!film.movie.country[1] && film.movie.country[0].slug === "nhat-ban" && film.movie.type === "hoathinh") {
                // Prepare status for insertion or update
                done = false;

                const episode_total = parseInt(film.movie.episode_total);
                const totalEpisode = Number.isNaN(episode_total) ? Infinity : parseInt(film.movie.episode_total);
                const currentEpisode = film.movie.episode_current.match(/Full|Hoàn tất/i) === null ? parseInt(film.movie.episode_current.split("Tập ")[1]) : totalEpisode;
                const categories: string[] = [];
                let hasSciFi = false;

                film.movie.category.forEach((category) => {
                    // If has sci-fi category, don't add khoa hoc or vien tuong
                    if ((category.name.toUpperCase() === "KHOA HỌC" || category.name.toUpperCase() === "VIỄN TƯỞNG") && hasSciFi) return;

                    const match = allCategories.find((cat) => cat.name.toUpperCase().includes(category.name.toUpperCase()));
                    if (match) {
                        if (match.slug === "sci-fi") hasSciFi = true;
                        categories.push(match.slug);
                    }
                });

                const payload = {
                    status: film.movie.status === "trailer" ? "upcoming" : film.movie.status as "ongoing" | "completed" | "upcoming" | "cancelled",
                    totalEpisode,
                    currentEpisode,
                    categories,
                }

                // Find the film in the database
                const match = await DBFilm.findOne({ slug: film.movie.slug });

                console.log("Crawled film", film.movie.slug);
                console.log("New", !match);

                // Check if film already exists, if not insert it
                if (!match) {
                    await DBFilm.insertOne({
                        slug: film.movie.slug,
                        name: film.movie.name,
                        originName: film.movie.origin_name,
                        description: film.movie.content,
                        createdAt: new Date(film.movie.created.time).getTime(),
                        updatedAt: new Date(film.movie.modified.time).getTime(),
                        thumbnail: film.movie.thumb_url,
                        poster: film.movie.poster_url,
                        trailer: film.movie.trailer_url,
                        subLang: film.movie.lang,
                        views: 0,
                        rating: 0,
                        year: film.movie.year,
                        duration: parseInt(film.movie.time),
                        episodes: film.episodes.map((episode) => ({
                            serverName: episode.server_name,
                            data: episode.server_data.map((data) => ({
                                slug: data.slug,
                                name: data.name,
                                m3u8Link: data.link_m3u8,
                            })),
                        })),
                        ...payload,
                    });
                } else {
                    // Else if exist and has been updated, update the database
                    if (match.updatedAt !== new Date(film.movie.modified.time).getTime()) {
                        await DBFilm.updateOne({ slug: film.movie.slug }, {
                            $set: {
                                updatedAt: new Date(film.movie.modified.time).getTime(),
                                // This regex might perform poorly (delete "tất" and i flag to optimize)
                                thumbnail: film.movie.thumb_url,
                                poster: film.movie.poster_url,
                                trailer: film.movie.trailer_url,
                                subLang: film.movie.lang,
                                episodes: film.episodes.map((episode) => ({
                                    serverName: episode.server_name,
                                    data: episode.server_data.map((data) => ({
                                        slug: data.slug,
                                        name: data.name,
                                        m3u8Link: data.link_m3u8,
                                    })),
                                })),
                                ...payload,
                            },
                        });
                    } else {
                        // Else stop crawling   
                        console.log("Finished crawling (film existed)");
                        done = true;
                        break;
                    }
                }
            }

            if (main.items.length === 0) {
                console.log("Finished crawling(Out of films)");
                done = true;
                break;
            }
        }
    }
};

ophim1();

