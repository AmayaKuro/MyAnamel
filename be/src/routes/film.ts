import express from "express";
import * as api from "../api/film";


const filmRouter = express.Router();

filmRouter.get("/new", api.newFilms);
filmRouter.get("/top", api.topFilms);
filmRouter.get("/popular", api.popularFilms);
filmRouter.get("/search", api.searchFilmName); 
filmRouter.get("/category/:slug", api.categoryFilm);
filmRouter.get("/:slug", api.specificFilm);

export default filmRouter;