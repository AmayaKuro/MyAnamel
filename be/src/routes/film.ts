import express from "express";
import * as api from "../api/film";


const filmRouter = express.Router();

filmRouter.get("/new", api.newFilms);
filmRouter.get("/top", api.topFilms)
filmRouter.get("/category/:slug", api.categoryFilm);
filmRouter.get("/:slug", api.specificFilm);

export default filmRouter;