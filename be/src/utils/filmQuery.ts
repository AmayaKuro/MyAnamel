import { Request } from "express";

const inputQuery = (req: Request) => {
    let page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    page = (page < 1 || Number.isNaN(page)) ? 1 : page;
    let extend = req.query.extend === "true";
    let name = (typeof req.query.name !== "string" || req.query.name.length < 1) ? "" : req.query.name;

    return {
        page,
        extend,
        name,
    };
}

export default inputQuery;