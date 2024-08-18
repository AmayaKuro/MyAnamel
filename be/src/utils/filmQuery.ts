import { Request } from "express";

const inputPagination = (req: Request) => {
    let cursor, page;

    if (typeof req.query.cursor === "string") {
        const data = req.query.cursor.split("_");

        const updatedAt = new Date(data[0]), id = data[1];

        cursor = (updatedAt && id) ? { updatedAt, id } : null;
    } else if (typeof req.query.page === "string") {
        const data = parseInt(req.query.page);

        page = (data > 1) ? page : null;
    }

    return {
        cursor,
        page,
    };
}

export { inputPagination };