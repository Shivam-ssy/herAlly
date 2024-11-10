import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const registerNgo = asyncHandler( async (req, res) => {
   
    const {phone,password, } = req.body
    console.log("phone: ", req.body);

    if (
        [phone, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Users.findOne({
      phone
    })

    if (existedUser) {
        throw new ApiError(409, "User with Phone  already exists")
    }
    //console.log(req.files);
   const generateRandomFiveDigit=()=> {
        // Generate a random number between 10000 and 99999
        const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
        return randomFiveDigit;
      }
      const digit=generateRandomFiveDigit()
    const Name = `USER${digit}`
    const user = await Users.create({
        name:Name,
        number:Number(phone), 
        password,
    })

    const createdUser = await Users.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )