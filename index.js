import express from 'express';
import cors from 'cors';
import scriptRoutes from "./routes/scriptRoutes.js";
import dotenv from "dotenv";
dotenv.config(); //to read api key from .env file


const app=express();
app.use(cors());
app.use(express.json());

//frontend request path
app.use("/api/script",scriptRoutes);

//run the server
app.listen(5000,()=>{console.log("backend running on 5000")});