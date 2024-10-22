import mongoose from "mongoose";
import User from "./User.js";


const menuItem=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
})

const restaurantSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:User,
        required:true
    },
    restaurantName:{
        required:true,
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    deliveryPrice:{
        type:Number,
        required:true
    },
    deliveryTime:{
        type:Number,
        required:true
    },
    cuisines:[{
        type:String,
        required:true
    }],
    menuItems:[menuItem],
    imageUrl:{
        type:String,
        required:true
    },
    lastUpdate:{
        type:Date,
        required:true,
        default:Date.now()
    }
})


const Restaurant=mongoose.model("Restaurant",restaurantSchema);

export default Restaurant;


