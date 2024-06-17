import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../utils/database";
import inputQuery from "../utils/filmQuery";


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
                originName: 1,
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
                originName: 1,
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



export { add, specificFilm, topFilms, categoryFilm };

