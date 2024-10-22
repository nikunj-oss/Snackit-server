import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken"
import User from "../models/User.js";
export const jwtCheck = auth({
    audience: 'snackit-api',
    issuerBaseURL: 'https://dev-gfemhuwpuvafhw4p.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  }); 

 
  export const jwtParse=async (req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization || !authorization.startsWith("Bearer ")){
        
        return res.status(401).json({error:"unauthorized"})
    }
    
    const token=authorization.split(" ")[1];
    try{
        const decoded=jwt.decode(token) 
        const auth0Id=decoded.sub
        const user=await User.findOne({auth0Id})
        

        if(!user){
            return res.status(404).json({error:"User Not Found"})
        }
        req.auth0Id=auth0Id;
        req.userId=user._id.toString()
        next()

    }
    catch(e){
        res.status(401).json({error:"unauthorized"})
    }


  } 