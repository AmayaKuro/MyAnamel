import { Response } from "express";


type ResponsePackingProps = {
    statusCode?: number;
    message?: string;
    data?: any;
};

/**
 * Send response to client. If statusCode or messsage is empty, send 200 and success.
 * @param res - Response object 
 * @param props - Object containing statusCode, message, and data
 */
const responsePacking = (res: Response, props?: ResponsePackingProps) => {
    const { statusCode = 200, message = "success", data } = props || {};
    
    res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        data: data,
    });
};


export default responsePacking;

