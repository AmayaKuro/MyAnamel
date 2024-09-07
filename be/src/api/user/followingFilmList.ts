import { Request, Response, NextFunction } from "express";

import { DBFilm, DBFollowingFilm } from "../../utils/database";
import responsePacking from "../../utils/responsePacking";

const followingFilmList = async (req: Request, res: Response, next: NextFunction) => {
    const followingFilmSlugs = (await DBFollowingFilm.find({
        UUID: req.user.UUID
    }).toArray()).map((followingFilm) => followingFilm.filmSlug);

    console.log("followingFilmSlugs", followingFilmSlugs)
    const films = await DBFilm.find({
        slug: {
            $in: [...followingFilmSlugs],
        }
    }).project({
        _id: 1,
        slug: 1,
        name: 1,
        originName: 1,
        thumbnail: 1,
        poster: 1,
        views: 1,
        rating: 1,
    }).toArray();


    responsePacking(res, {
        data: {
            films,
        },
    });

};

export default followingFilmList;