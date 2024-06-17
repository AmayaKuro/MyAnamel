import express from "express";

import searchFilmName from "../api/searchFilmName";
import searchSpecificFilm from "../api/searchSpecificFilm";
import popularFilms from "../api/popularFilms";
import newFilms from "../api/newFilms";

const filmRouter = express.Router();

filmRouter.get("/new", newFilms);
filmRouter.get("/popular", popularFilms);
filmRouter.get("/search", searchFilmName);
filmRouter.get("/:slug", searchSpecificFilm);

export default filmRouter;