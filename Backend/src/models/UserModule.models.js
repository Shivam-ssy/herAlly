import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const User =new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        number:
        {
            type : String, 
            required:true, 
            lowercase: true ,
            unique:true
        },
        password:{
            type:String, 
            required:true
        },
        refreshToken: {
            type: String
        },
    },
    
)


User.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
User.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

User.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
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

const Users=mongoose.model('Users',User)
export {Users}