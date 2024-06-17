import { Request, Response, NextFunction } from "express";

import responsePackings from "../utils/responsePacking";
import { DBFilm } from "../utils/database";
import inputQuery from "../utils/filmQuery";


const searchFilmName = async (req: Request, res: Response, next: NextFunction) => {
    const { name, extend } = inputQuery(req);
    const cursor = req.query.cursor;

    if (!name) {
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
                            $regex: new RegExp(name, "i"),
                        },
                    },
                    {
                        originName: {
                            $regex: new RegExp(name, "i"),
                        },
                    },
                    {
                        slug: {
                            $regex: new RegExp(name, "i"),
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
                originName: 1,
                thumbnail: 1,
                poster: 1,
                views: 1,
                updatedAt: 1,
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
                ...(extend ? {
                    categories: 1,
                    description: 1,
                    currentEpisode: 1,
                    totalEpisode: 1,
                    year: 1,
                    duration: 1,
                } : {})
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

    responsePackings(res, {
        data: {
            films,
            cursor: films.length === 12
                ? films[films.length - 1].updatedAt + "_" + films[films.length - 1]._id
                : null,
        },
    });
}


export default searchFilmName;