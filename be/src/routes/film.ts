import express from "express";
import { add, listFilm, specificFilm } from "../api/film";


const filmRouter = express.Router();

filmRouter.get("/", listFilm);
filmRouter.get("/:slug", specificFilm);


export default filmRouter;