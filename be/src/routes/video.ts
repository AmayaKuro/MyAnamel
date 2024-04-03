import express from 'express';

const video = express.Router();

video.use("/full", express.static("public/videos/full",{cacheControl:true, maxAge: 31536000}));
video.use("/transcoded", express.static("public/videos/transcoded", {cacheControl:true, maxAge: 31536000}));

export default video;