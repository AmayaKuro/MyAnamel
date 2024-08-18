import { Request, Response, NextFunction } from "express";
import { Document } from "mongodb";

import responsePackings from "../utils/responsePacking";
import { DBFilm } from "../utils/database";
import { inputPagination } from "../utils/filmQuery";


const searchFilmName = async (req: Request, res: Response, next: NextFunction) => {
    const { q = "", extend } = req.query;
    const { cursor } = inputPagination(req);

    const filter = req.query.sort || "newest";

    if (!q || typeof q !== "string") {
        return next({
            statusCode: 400,
            message: "Film not found",
        });
    }

    let films;
    let pipeline: Document[] = [
        {
            $match: {
                $or: [
                    {
                        name: {
                            $regex: new RegExp(q, "i"),
                        },
                    },
                    {
                        originName: {
                            $regex: new RegExp(q, "i"),
                        },
                    },
                    {
                        slug: {
                            $regex: new RegExp(q, "i"),
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

    if (cursor) {
        pipeline.unshift({
            $match: {
                $or: [
                    {
                        updatedAt: { $lt: cursor.updatedAt },
                    },
                    {
                        updatedAt: { $eq: cursor.updatedAt },
                        _id: { $lt: cursor.id },
                    },
                ],
            },
        });
    }

    switch (filter) {
        case "newest":
            pipeline.unshift({
                $sort: {
                    updatedAt: -1,
                },
            });
            break;
        case "popular":
            pipeline.unshift({
                $sort: {
                    views: -1,
                },
            });
            break;
    };

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
            pagination: {
                cursor: films.length === 12
                    ? films[films.length - 1].updatedAt.getTime() + "_" + films[films.length - 1]._id
                    : "",
            }
        },
    });
}


export default searchFilmName;