import "dotenv/config.js";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import commonHeader from './middlewares/commonHeader.js';
import errorHandler from './middlewares/errorHandler.js';

import filmRouter from './routes/film.js';


// Options
const app = express();
const port = 8000;

app.disable('x-powered-by');


// Middlewares
const corsOptions = {
    origin: ["http://localhost:3000"],
}

app.use(morgan("dev"), cors(corsOptions), commonHeader);


// Routes
app.use("/film", filmRouter);

app.get('/', async (req, res) => {
    res.send("No!");
});

// 404 route
app.use((req, res, next) => {
    return next({
        statusCode: 404,
        message: "Not found",
    });
});

app.use(errorHandler);


app.listen(port, () => {
    // convertVideo("public\\videos\\full\\2024-02-14 21-26-20.mp4", "public\\videos\\transcoded\\folder\\playlist.m3u8", "public\\videos\\transcoded\\folder\\segment%03d.ts")
    console.log(`Server is running on port ${port}`);
});