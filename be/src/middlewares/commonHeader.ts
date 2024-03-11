import { Request, Response,NextFunction } from "express";


const Handler = (req: Request, res: Response, next: NextFunction) => {
    // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("X-Content-Type-Options", "nosniff");
    next();
};

export default Handler;