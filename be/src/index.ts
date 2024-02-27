import express, { Request, Response } from 'express';
import morgan from 'morgan';

import videos from './routes/videos.js';


const app = express();
const port = 8000;


// Middlewares
app.use(morgan('tiny'));

// Routes
app.use("/videos", videos);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});