import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import connectDB from "./src/db/Db.js";
const port=process.env.PORT || 3000
import { app,server } from "./src/app.js";




//Database connection and starting the server

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

app.get("/",(req,res)=>{
    res.send("HELLO THIS IS SHIVAM ")
   
    
})


