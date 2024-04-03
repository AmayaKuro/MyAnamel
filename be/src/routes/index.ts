import express  from "express";

import video from "./video";


const routes = express.Router();

routes.use("/video", video);
// routes.use("");


export default routes;