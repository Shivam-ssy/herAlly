import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
const origin= process.env.frontend_url || "http://localhost:5173";
app.use(cors({
  origin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials:true,
})); 


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())



//routes import
import userRouter from './routes/user.routes.js'
// //routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register


export { app }

