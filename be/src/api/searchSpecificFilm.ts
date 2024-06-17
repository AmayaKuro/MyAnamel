import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../utils/database";
import responsePacking from "../utils/responsePacking";

const searchSpecificFilm = async (req: Request, res: Response, next: NextFunction) => {
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

    responsePacking(res, {
        data: film[0],
    });

};

export default searchSpecificFilm;