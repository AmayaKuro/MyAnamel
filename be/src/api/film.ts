import { Request, Response, NextFunction } from "express";

import { DBFilm, DBCategory } from "../utils/database";

// Add after finish the whole project 
const add = (req: Request, res: Response) => {
    res.send("Film");
};

const listFilm = async (req: Request, res: Response, next: NextFunction) => {
    const result = await DBFilm.find({}).limit(20).toArray();

    res.send(result);
}

const specificFilm = async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.slug) {
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

        const film = await DBFilm.aggregate(pipeline).toArray();

        // If film not found, return 400
        if (!film[0]) {
            return res.status(400).json({
                error: "Film not found",
            });
        }

        res.status(200).json(film[0]);
    }
};


export { add, listFilm, specificFilm };

