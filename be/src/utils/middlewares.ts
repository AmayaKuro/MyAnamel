import { Request, Response, NextFunction } from "express";


const commonHeader = (req: Request, res: Response, next: NextFunction) => {
    // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("X-Content-Type-Options", "nosniff");
    next();
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // For debug purpose
    if (!err.status && !err.statusCode) {
        console.log(err);
    }

    res.status(err.statusCode || err.status || 500).json({
        statusCode: err.statusCode || err.status || 500,
        message: err.message,
    });
}


export { commonHeader, errorHandler };