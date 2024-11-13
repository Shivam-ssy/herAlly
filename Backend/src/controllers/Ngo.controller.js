import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NgoUsers } from "../models/Ngo.model.js";
import { Message } from "../models/Message.model.js";
import { Users } from "../models/UserModule.models.js";
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await NgoUsers.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
const options = {
   
    httpOnly:true,
    secure:true,
    maxAge:7200000,
    sameSite: 'None'
}
const registerNgo = asyncHandler( async (req, res) => {
   
    const {name,email,number,uniqueId,state,district,password,details } = req.body
    console.log("phone: ", req.body);

    if (
        [number, password,uniqueId].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Number, password, uniqueId are required")
    }

    const existedUser = await NgoUsers.findOne({
      number
    })

    if (existedUser) {
        throw new ApiError(409, "User with Phone  already exists")
    }
    //console.log(req.files);
      
    const userNgo = await NgoUsers.create({
        name,
        number:Number(number), 
        email,
        state,
        district,
        uniqueId,
        password,
        details
    })

    const createdUser = await NgoUsers.findById(userNgo._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )


const loginNgo = asyncHandler(async (req, res) =>{
   

    const {email, password} = req.body

    if (!email) {
        throw new ApiError(400, " Phone is required")
    }
    
    const user = await NgoUsers.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await NgoUsers.findById(user._id).select("-password -refreshToken")

    console.log(loggedInUser)
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser
            },
            "ngo User logged In Successfully"
        )
    )
    


})


const listNgos=asyncHandler(async(req,res)=>{
    const ngoList = await NgoUsers.find({isVarified:true}).select("-password -accessToken");
    if(!ngoList)
        throw new ApiError(500,"Something went wrong while fetching")
     return res.status(200).json(
        new ApiResponse(200,ngoList,"Fetched successfully")
     )
     
})


const listConnectedUser=asyncHandler(async(req,res)=>{
    const NgoUser=req.user;
    // console.log(NgoUser);
    
    const messages = await Message.aggregate([
        { 
            $match: { recipient: NgoUser._id } 
        },
        { 
            $sort: { timestamp: -1 } 
        },
        { 
            $group: {
                _id: "$sender", 
                latestMessage: { $first: "$$ROOT" } 
            }
        },
        {
            $replaceRoot: { newRoot: "$latestMessage" } 
        }
    ]);

    if (messages && messages.length > 0) {
        // Use a Map to ensure unique entries based on a specified key (e.g., 'sender')
        const uniqueSenderIds = [...new Set(messages.map(message => message.sender))];

        // Fetch user data for each unique sender ID
        const users = await Promise.all(uniqueSenderIds.map(async (senderId) => {
            return await Users.findById({_id: senderId}).select("-number -password");
        }));
        return res.status(200).json(
            new ApiResponse(200, users, "Unique users fetched successfully")
        );
    }
    throw new ApiError(404,"No user found")
})

export {registerNgo,loginNgo,listNgos,listConnectedUser}