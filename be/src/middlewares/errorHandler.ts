import { Request, Response, NextFunction } from "express";

import responsePacking from "../utils/responsePacking";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // For debug purpose
    if (!err.statusCode) {
        console.log(err.stack);
    }

    responsePacking(res, {
        statusCode: err.statusCode || 500,
        message: err.statusCode ? err.message : "Internal server error"
    });
}


export default errorHandler;
