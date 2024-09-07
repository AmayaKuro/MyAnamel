import { Request, Response, NextFunction } from "express";

import { DBFilm, DBFollowingFilm } from "../../utils/database";
import responsePacking from "../../utils/responsePacking";

const followingFilm = async (req: Request, res: Response, next: NextFunction) => {
    const { filmSlug, action } = req.body;

    if (!await DBFilm.findOne({ slug: filmSlug })) {
        return responsePacking(res, {
            statusCode: 400,
            message: "Bad request",
        });
    }

    if (action === "follow" && await DBFollowingFilm.findOne({ UUID: req.user.UUID, filmSlug })) {
        return responsePacking(res, {
            statusCode: 400,
            message: "Bad request",
        });
    }

    if (action === "follow") {
        await DBFollowingFilm.insertOne({ UUID: req.user.UUID, filmSlug });
    } else if (action === "unfollow") {
        await DBFollowingFilm.deleteOne({ UUID: req.user.UUID, filmSlug });
    }

    // Return success status 
    return responsePacking(res);
}

export default followingFilm;