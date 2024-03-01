import express, { Request, Response } from 'express';

const videos = express.Router();

videos.use("/full", express.static("public/videos/full",{cacheControl:true, maxAge: 31536000}));
videos.use("/transcoded", express.static("public/videos/transcoded", {cacheControl:true, maxAge: 31536000}));

export default videos;