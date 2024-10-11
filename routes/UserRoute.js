import  {createCurrentUser, getUserProfile, updateCurrentUser}  from "../controllers/User.js";
import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateMyUser } from "../middleware/validation.js";


const app=express.Router();

app.get("/",jwtCheck,jwtParse,getUserProfile);


app.post("/",jwtCheck,createCurrentUser)

app.put("/",jwtCheck,jwtParse,validateMyUser,updateCurrentUser)




export default app; 