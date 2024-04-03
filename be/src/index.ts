import "dotenv/config.js";
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import commonHeader from './middlewares/commonHeader.js';

import routes from './routes';

import { DBCategory } from './utils/database.js';


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
app.use(routes);

app.get('/', async (req: Request, res: Response) => {
    const result = await DBCategory.insertOne({
        slug: "hanh-dong",
        name: "Hành động",
    });
    
    res.send(result);
});


app.listen(port, () => {
    // convertVideo("public\\videos\\full\\2024-02-14 21-26-20.mp4", "public\\videos\\transcoded\\folder\\playlist.m3u8", "public\\videos\\transcoded\\folder\\segment%03d.ts")
    console.log(`Server is running on port ${port}`);
});