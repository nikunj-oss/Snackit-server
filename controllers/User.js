import User from "../models/User.js"


export const createCurrentUser=async (req,res)=>{
    try{
        const {auth0Id}=req.body
        const user=await User.findOne({auth0Id})
        //check if already exist
        if(user){
            return res.status(200).send()
            
        }
        //if not create a new user
        const newUser=new User(req.body);
        await newUser.save();
        
        
        //send user data

        res.status(201).json(newUser.toObject());

    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Error Creating a User"})
    }
}

export const updateCurrentUser=async (req,res)=>{
    try{
        const {addressLine1,country,city,name}=req.body
        const user=await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        user.name=name
        user.addressLine1=addressLine1;
        user.city=city;
        user.country=country;

        await user.save();

        res.send(user)

    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Error Updating a User"})
    }
}



export const getUserProfile=async (req,res)=>{
    try {
        const user=await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        res.json(user);

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error finding the user"})
    }

}