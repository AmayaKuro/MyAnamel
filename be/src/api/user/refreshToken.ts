import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import responsePacking from "../../utils/responsePacking";
import { DBAccessToken, DBBlackListToken } from "../../utils/database";
import { SECRET_KEY } from "../../utils/env";


const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // This jwt is optional, but need for CV lmao (also decoding jwt takes resources)
    const newAccessToken = jwt.sign({ UUID: user.UUID }, SECRET_KEY, { expiresIn: "3d" });

    DBAccessToken.insertOne({
        UUID: user.UUID,
        token: newAccessToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + 3 * 24 * 60 * 60 * 1000,

        ip: req.ip,
    });

    // Add old token to blacklist
    DBBlackListToken.insertOne({
        token: user.ac_to,
    });

    // Send success response
    responsePacking(res, {
        data: {
            name: user.name,
            ac_to: newAccessToken,
        },
    });
}


export default refresh;