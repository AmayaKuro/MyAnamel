import { Request, Response, NextFunction } from "express";

import { DBFollowingFilm } from "../../utils/database";
import responsePacking from "../../utils/responsePacking";

const followingFilmList = async (req: Request, res: Response, next: NextFunction) => {
    const { filmSlug } = req.params;

    const following = await DBFollowingFilm.findOne({ UUID: req.user.UUID, filmSlug: filmSlug });

    if (following) {
        responsePacking(res, {
            data: {
                following: true,
            },
        });
    } else {
        responsePacking(res, {
            statusCode: 400,
            message: "Bad request",
            data: {
                following: false,
            },
        });
    }
};

export default followingFilmList;