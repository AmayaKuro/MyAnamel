import { Request, Response, NextFunction } from "express";

import responsePacking from "../../utils/responsePacking";
import { DBBlackListToken } from "../../utils/database";


const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Add old token to blacklist
    DBBlackListToken.insertOne({
        token: user.ac_to,
    });

    // Send success response
    responsePacking(res);
}


export default refresh;