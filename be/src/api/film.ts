import { Request, Response, NextFunction } from "express";

import { DBFilm, DBCategory } from "../utils/database";

// Add after finish the whole project 
const add = (req: Request, res: Response) => {
    res.send("Film");
};

const listFilm = async (req: Request, res: Response, next: NextFunction) => {
    let films;
    let pipeline = [
        {
            $limit: 10,
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

const specificFilm = async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.slug) {
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
    }
    else {
        next({
            statusCode: 400,
            message: "Film not found",
        });
    }
};


export { add, listFilm, specificFilm };

