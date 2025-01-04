import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
import { Request, Response, Application } from "express";

dotenv.config();

const app: Application = express();

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});