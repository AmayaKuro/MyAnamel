import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import commonHeader from './middlewares/commonHeader.js';

import videos from './routes/videos.js';

import convertVideo from './utils/ffmpeg.js';


const app = express();
const port = 8000;

app.disable('x-powered-by');


// Middlewares
const corsOptions = {
    origin: ["http://localhost:3000"],
}

app.use(morgan('tiny'), cors(corsOptions), commonHeader);


// Routes
app.use("/videos", videos);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
    // convertVideo("public\\videos\\full\\2024-02-14 21-26-20.mp4", "public\\videos\\transcoded\\folder\\playlist.m3u8", "public\\videos\\transcoded\\folder\\segment%03d.ts")
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});