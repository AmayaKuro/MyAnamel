import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../utils/database";
import inputQuery from "../utils/filmQuery";
import responsePacking from "../utils/responsePacking";

const newFilms = async (req: Request, res: Response, next: NextFunction) => {
    const { page } = inputQuery(req);

    let film;

    try {
        film = await DBFilm.aggregate([
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
        ]).toArray();
    } catch (err) {
        console.log(err);

        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    responsePacking(res, {
        data: film,
    });
}

export default newFilms;