import { Response } from "express";


type ResponsePackingProps = {
    statusCode?: number;
    message?: string;
    data?: any;
};

/**
 * Send response to client. If statusCode or messsage is empty, send 200 status or success message.
 * @param res - Response object 
 * @param props - Object containing statusCode, message, and data
 */
const responsePacking = (res: Response, props?: ResponsePackingProps) => {
    const { statusCode = 200, message = "success", data } = props || {};

    res.status(statusCode).json({ statusCode, message, data });
};


export default responsePacking;

