import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../../utils/database";
import { CURRENT_SEASON } from "../../utils/env";
import { inputPagination } from "../../utils/filmQuery";
import responsePacking from "../../utils/responsePacking";

const popularFilms = async (req: Request, res: Response, next: NextFunction) => {
    const { extend } = req.query;
    const { page } = inputPagination(req);

    let pipeline = [
        ...(page ? [
            {
                $skip: (page - 1) * 12,
            },
        ] : []),
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
                rating: { $cond: [{ $eq: ["$rateCount", 0] }, "$rating", { $divide: ["$rating", "$rateCount"] }] },
                ...(extend === "true" ? {
                    categories: 1,
                    description: 1,
                    currentEpisode: 1,
                    totalEpisode: 1,
                    year: 1,
                    duration: 1,
                } : {})
            },
        },
        ...(extend === "true" ? [
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

    const films = await DBFilm.aggregate(pipeline).toArray();

    responsePacking(res, {
        data: films,
    });
}

export default popularFilms;