import { Request, Response, NextFunction } from "express";


const commonHeader = (req: Request, res: Response, next: NextFunction) => {
    // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("X-Content-Type-Options", "nosniff");
    next();
};

export default commonHeader;