import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../utils/database";
import { CURRENT_SEASON } from "../utils/env";


const inputQuery = (req: Request) => {
    let page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    page = (page < 1 || Number.isNaN(page)) ? 1 : page;
    let extend = req.query.extend === "true" ? true : false;

    return {
        page,
        extend,
    };
}

// Add after finish the whole project 
const add = (req: Request, res: Response) => {
    res.send("Film");
};

const specificFilm = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.slug) {
        return next({
            statusCode: 400,
            message: "Film not found",
        });
    }

    let film;
    let pipeline = [
        {
            $match: {
                slug: req.params.slug,
            },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "slug",
                as: "categories",
            },
        },
    ];

    try {
        film = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    // If film not found, return 400
    if (!film[0]) {
        return next({
            statusCode: 400,
            message: "Film not found",
        });
    }

    res.status(200).json(film[0]);

};

const newFilms = async (req: Request, res: Response, next: NextFunction) => {
    const { page } = inputQuery(req);

    let film;
    let pipeline = [
        {
            $sort: {
                updatedAt: -1,
            },
        },
        {
            $skip: (page - 1) * 12,
        },
        {
            $limit: 12,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
            },
        },
    ];

    try {
        film = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    res.status(200).send(film);
}

const topFilms = async (req: Request, res: Response, next: NextFunction) => {
    const { page } = inputQuery(req);

    let film;
    let pipeline = [
        {
            $sort: {
                views: -1,
            },
        },
        {
            $skip: (page - 1) * 12,
        },
        {
            $limit: 12,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
            },
        },
    ];

    try {
        film = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    res.status(200).send(film);
}

const categoryFilm = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.slug) {
        return next({
            statusCode: 400,
            message: "Film not found",
        });
    }

    const { page } = inputQuery(req);

    let films;
    let pipeline = [
        {
            $match: {
                categories: req.params.slug,
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
        {
            $skip: (page - 1) * 12,
        },
        {
            $limit: 12,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
            },
        },
    ];

    try {
        films = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    res.status(200).send(films);
}

const popularFilms = async (req: Request, res: Response, next: NextFunction) => {
    const { page, extend } = inputQuery(req);

    let films;
    let pipeline = [
        {
            $addFields: {
                season: { $ceil: { $divide: [{ $month: "$updatedAt" }, 3] } },
            },
        },
        {
            $match: {
                ...(CURRENT_SEASON === 1
                    ? {
                        // If current season is 1, then get season 1 and 4
                        season: { $in: [1, 4] },
                    } : {
                        // else get current season and pervious season
                        season: {
                            $gte: CURRENT_SEASON - 1,
                            $lte: CURRENT_SEASON,
                        },
                    }),
            }
        },
        {
            $sort: {
                // If current season is 1, then the higher year first, else higher season first
                ...(
                    CURRENT_SEASON === 1
                        ? { year: -1 }
                        : { session: -1 }
                ),
                views: -1,
                rating: -1,
                updatedAt: -1,
            },
        },
        {
            $skip: (page - 1) * 12,
        },
        {
            $limit: 12,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
                ...(extend ? {
                    categories: 1,
                    originName: 1,
                    description: 1,
                    currentEpisode: 1,
                    totalEpisode: 1,
                    year: 1,
                    duration: 1,
                } : {})
            },
        },
        ...(extend ? [
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "slug",
                    as: "categories",
                },
            },
        ] : [])
    ];

    try {
        films = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    res.status(200).send(films);
}

const searchFilmName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name !== "string" || req.query.name.length < 1) {
        return next({
            statusCode: 400,
            message: "Film not found",
        });
    }

    let films;
    let pipeline = [
        {
            $match: {
                $or: [
                    {
                        name: {
                            $regex: new RegExp(req.query.name, "i"),
                        },
                    },
                    {
                        originName: {
                            $regex: new RegExp(req.query.name, "i"),
                        },
                    },
                    {
                        slug: {
                            $regex: new RegExp(req.query.name, "i"),
                        },
                    }
                ],
            },
        },
        {
            $limit: 12,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
                categories: 1,
                originName: 1,
                description: 1,
                currentEpisode: 1,
                totalEpisode: 1,
                year: 1,
                duration: 1,
            },
        },
    ];

    try {
        films = await DBFilm.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    res.status(200).send(films);
}


export { add, specificFilm, newFilms, topFilms, popularFilms, categoryFilm, searchFilmName };

