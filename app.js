import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { corsOptions } from "./constants/constants.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import UserRoute from "./routes/UserRoute.js"
import  RestaurantRoute  from "./routes/RestaurantRoute.js"

dotenv.config({
    path:"./.env"
})
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected..."))


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app=express();
const PORT=process.env.PORT || 3000

app.use(cors(corsOptions));

app.use(express.json())
app.use(cookieParser());


app.get("/health",async(req,res)=>{
    res.send({
        message:"Health Ok!"
    })
})

app.use("/api/v1/user",UserRoute);
app.use("/api/v1/restaurant",RestaurantRoute)


app.listen(PORT,()=>{
    console.log(`Server running on the port ${PORT}`)
})