import { Request, Response, NextFunction } from "express";

import { DBFilm } from "../../utils/database";
import responsePacking from "../../utils/responsePacking";

// This will be use for rate limiting for view count (should switch from IP to user's other unique identifier)
var viewHistory: {
    IP: string;
    viewCountCoolDown: {
        [filmSlug: string]: number;
    };
}[] = [];

const viewControl = async (req: Request, res: Response, next: NextFunction) => {
    const { filmSlug } = req.body;
    let film;

    try {
        film = await DBFilm.updateOne({
            slug: filmSlug,
        }, {
            $inc: {
                views: 1,
            },
        });

        console.log("output film", film)
    } catch (err) {
        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }

    if (!film) {
        return responsePacking(res, {
            statusCode: 400,
            message: "Bad request",
        });
    }

    // Return success status 
    return responsePacking(res);
}

export default viewControl;