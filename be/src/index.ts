import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});