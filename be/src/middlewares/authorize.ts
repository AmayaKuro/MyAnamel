import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { DBAccessToken, DBBlackListToken } from "../utils/database";
import responsePacking from "../utils/responsePacking";
import { SECRET_KEY } from "../utils/env";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next({
            statusCode: 400,
            message: "Bad request",
        });
    }

    const ac_to = authorization.split(" ")[1];

    // Check if token blacklisted
    if (await DBBlackListToken.findOne({ token: ac_to })) {
        return next({
            statusCode: 400,
            message: "Bad request",
        });
    }

    const accessToken = await DBAccessToken.findOne({ token: ac_to });

    // Check if token valid
    // Alternative: accessToken.expiredAt < Date.now() 
    if (!accessToken || !jwt.verify(ac_to, SECRET_KEY)) {
        return responsePacking(res, {
            statusCode: 400,
            message: "Bad request",
        });
    }

    // Add user info to the request and continue
    req.user = {
        UUID: accessToken.UUID,
        ac_to: ac_to,

        ip: req.ip,
    };

    return next();
}


export default authorize;
