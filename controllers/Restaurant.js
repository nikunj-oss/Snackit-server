import Restaurant from "../models/Restaurant.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const createRestaurant = async (req, res) => {
    try {
        
        // Check for required restaurant image
        if (!req.files || !req.files['restaurantImage'] || req.files['restaurantImage'].length === 0) {
            return res.status(400).json({ message: "Restaurant image is required." });
        }

        // Check if the user already has a restaurant
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });
        if (existingRestaurant) {
            return res.status(409).json({ message: "You already have a restaurant." });
        }

        // Upload restaurant image to Cloudinary
        const restaurantImage = req.files['restaurantImage'][0];
        const Base64restaurantImage = Buffer.from(restaurantImage.buffer).toString("base64");
        const restaurantImageURI = `data:${restaurantImage.mimetype};base64,${Base64restaurantImage}`;
        const restaurantImageUploadResponse = await cloudinary.v2.uploader.upload(restaurantImageURI);

        // Directly assign menuItems instead of parsing
        const menuItems = req.body.menuItems || []; // Make sure it's an array

        // Check for menu images
        const menuImages = req.files['menuImages'] || [];

        // Create menu items with images
        const menuItemWithImages = await Promise.all(menuItems.map(async (item, index) => {
            const menuImage = menuImages[index];
            const menuItemData = {
                name: item.name.trim(),
                price: parseFloat(item.price),
                image: null,
            };

            if (menuImage) {
                const Base64menuImage = Buffer.from(menuImage.buffer).toString("base64");
                const menuImageURI = `data:${menuImage.mimetype};base64,${Base64menuImage}`;
                const menuImageUploadResponse = await cloudinary.v2.uploader.upload(menuImageURI);
                menuItemData.image = menuImageUploadResponse.url;
            }

            return menuItemData;
        }));

        // Create a new restaurant document
        const restaurant = new Restaurant({
            ...req.body,
            user: new mongoose.Types.ObjectId(req.userId),
            imageUrl: restaurantImageUploadResponse.url,
            menuItems: menuItemWithImages,
            lastUpdate: new Date(),
        });

        // Save the restaurant to the database
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ message: "There was an error creating the restaurant." });
    }
};



export const getMyRestaurant=async (req,res)=>{
    try{
        const restaurant=await Restaurant.findOne({user:req.userId});
        if(!restaurant){
            return res.status(404).json("Restaurant not found")
        }
        res.status(200).json(restaurant)

    }
    catch(e){
        console.error('Error fetching restaurant:', e);
        res.status(500).json({message:"Unable to fetch the restaurant"})
    }
}


export const editMyRestaurant = async (req, res) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });

        if (!existingRestaurant) {
            return res.status(404).json("Restaurant not found");
        }
        existingRestaurant.restaurantName = req.body.restaurantName;
        existingRestaurant.city = req.body.city;
        existingRestaurant.country = req.body.country;
        existingRestaurant.deliveryPrice = req.body.deliveryPrice;
        existingRestaurant.deliveryTime = req.body.deliveryTime;
        existingRestaurant.cuisines = JSON.parse(req.body.cuisines); // Parse if it's a JSON string
        existingRestaurant.lastUpdate = new Date();
        
        if (req.files) {
            const restaurantImage = req.files['restaurantImage'] ? req.files['restaurantImage'][0] : null;
            if (restaurantImage) {
                const Base64restaurantImage = Buffer.from(restaurantImage.buffer).toString("base64");
                const restaurantImageURI = `data:${restaurantImage.mimetype};base64,${Base64restaurantImage}`;
                const restaurantImageUploadResponse = await cloudinary.v2.uploader.upload(restaurantImageURI);
                existingRestaurant.imageUrl = restaurantImageUploadResponse.url;
            }

            const menuImages = req.files['menuImages'] || [];
            const menuItems = req.body.menuItems || []; // Ensure menuItems is defined
            const menuItemWithImages = await Promise.all(menuItems.map(async (item, index) => {
                const menuImage = menuImages[index];
                const menuItemData = {
                    name: item.name.trim(),
                    price: parseFloat(item.price),
                    image: null,
                };

                if (menuImage) {
                    const Base64menuImage = Buffer.from(menuImage.buffer).toString("base64");
                    const menuImageURI = `data:${menuImage.mimetype};base64,${Base64menuImage}`;
                    const menuImageUploadResponse = await cloudinary.v2.uploader.upload(menuImageURI);
                    menuItemData.image = menuImageUploadResponse.url;
                }

                return menuItemData;
            }));

            existingRestaurant.menuItems = menuItemWithImages;
        }

        // Save the restaurant
        await existingRestaurant.save();
        res.status(200).json({ message: "Edited restaurant successfully" });

    } catch (e) {
        console.error('Error editing restaurant:', e);
        res.status(500).json({ message: "Unable to edit the restaurant", error: e.message });
    }
};


