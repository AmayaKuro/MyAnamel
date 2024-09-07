import express from "express";

import searchFilmName from "../api/film/searchFilmName";
import searchSpecificFilm from "../api/film/searchSpecificFilm";
import popularFilms from "../api/film/popularFilms";
import newFilms from "../api/film/newFilms";
import viewControl from "../api/film/viewControl";
import followFilm from "../api/film/followFilm";

import authorize from "../middlewares/authorize";

const filmRouter = express.Router();

filmRouter.get("/new", newFilms);
filmRouter.get("/popular", popularFilms);
filmRouter.get("/search", searchFilmName);
filmRouter.get("/:slug", searchSpecificFilm);
filmRouter.post("/view", viewControl);
filmRouter.post("/follow", authorize, followFilm);

export default filmRouter;