import express from "express";
import cors from "cors";
import Routes from "./routes/Route.js";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(Routes);

try{
    await db.authenticate();
    console.log('Database Connected...');
}catch(error){
    console.error(error);
}

app.listen(5000, ()=> console.log('Server up and running...'));
