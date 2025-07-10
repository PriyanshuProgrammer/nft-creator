import cors from 'cors';
import express from 'express';
import { router } from './router/auth';

const app = express();

app.use(express.json());
app.use(cors())

app.use("/", router);

app.listen("3000", () => {
    console.log("server running on port : 3000");
});