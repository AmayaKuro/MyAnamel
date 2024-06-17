import { Response } from "express";


type ResponsePackingProps = {
    statusCode?: number;
    message?: string;
    data?: any;
};

const responsePacking = (res: Response, { statusCode = 200, message = "success", data }: ResponsePackingProps) => {
    res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        data: data,
    });
};


export default responsePacking;

