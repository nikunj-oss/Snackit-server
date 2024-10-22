import { body, validationResult } from "express-validator"

const handleValidationErrors=async (req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}
export const validateMyUser=[
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("name").isString().notEmpty().withMessage("AddressLine2 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,  
]

export const validateMyRestaurantRequest=[
    body("restaurantName").isString().notEmpty().withMessage("Name must be a string"),
    body("city").isString().notEmpty().withMessage("city must be a string"),
    body("country").isString().notEmpty().withMessage("country must be a string"),
    body("deliveryPrice").isFloat({min:0}).notEmpty().withMessage("Price must be Positive Number"),
    body("deliveryTime").isFloat({min:0}).notEmpty().withMessage("Time must be positve"),
    body("cuisines").isArray().not().withMessage("Must be a non empty array"),
    body("menuItems").isArray().withMessage("Must be an Array")
    ,handleValidationErrors,

]