import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const NgoUser =new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        email:
        {
            type : String, 
            required:true, 
            lowercase: true ,
            unique:true
        },
        number:
        {
            type : Number, 
            required:true, 
            unique:true
        },
        uniqueId:
        {
            type : String, 
            required:true, 
            lowercase: true ,
            unique:true
        },
        state:
        {
            type : String, 
            
            lowercase: true ,
        },
        district:
        {
            type : String, 
            
            lowercase: true ,
        },
        isVarified:
        {
            type : Boolean, 
            
            lowercase: true ,
            default:false,
        },
        password:{
            type:String, 
            
        },
        refreshToken: {
            type: String
        },
    },
    
)


NgoUser.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
NgoUser.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

NgoUser.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
User.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const NgoUsers=mongoose.model('NgoUsers',NgoUser)
export {NgoUsers}