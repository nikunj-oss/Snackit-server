import express from "express"
import { createRestaurant, editMyRestaurant, getMyRestaurant } from "../controllers/Restaurant.js";
import multer from "multer"
import { jwtCheck, jwtParse } from "../middleware/auth.js";
const app=express.Router();


const storage=multer.memoryStorage()

const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    }
})

const fileFields=[
    {
        name:'restaurantImage',maxCount:1
    },
    {
        name:'menuImages',maxCount:5
    }
]


app.get("/",jwtCheck,jwtParse,getMyRestaurant)

app.post("/",upload.fields(fileFields),jwtCheck,jwtParse,createRestaurant)


app.put('/',upload.fields(fileFields),jwtCheck,jwtParse,editMyRestaurant)
export default app   