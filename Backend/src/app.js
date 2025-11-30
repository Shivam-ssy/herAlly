import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Message } from "./models/Message.model.js";
const app = express()
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
const origin= process.env.frontend_url || "http://localhost:5173";
app.use(cors({
  origin,
  methods: ['GET', 'POST', 'OPTIONS','PATCH','DELETE','PUT'],
  allowedHeaders: ['Content-Type'],
  credentials:true,
})); 

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin,
    methods: ['GET', 'POST', 'OPTIONS','PATCH','DELETE','PUT'],
    credentials:true,
  }
});
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handler for joining a chat room
  socket.on('joinChat', async (data) => {
    const { senderId, recipientId } = data;

    try {
      // Fetch previous messages between sender and recipient from the database
      const previousMessages = await Message.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId },
        ],
      }).sort({ createdAt: 1 }); // Sort by creation date ascending

      // Join the room based on a unique combination of sender and recipient IDs
      const room = [senderId, recipientId].sort().join('_'); // Ensures consistent room naming
      socket.join(room);

      // Emit previous messages to the user who joined the chat
      socket.emit('previousMessages', previousMessages);
      console.log(`User ${senderId} joined room: ${room}`);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
      socket.emit('error', { message: 'Could not fetch previous messages' });
    }
  });

  // Handler for sending a message
  socket.on('sendMessage', async (data) => {
    const { senderId, recipientId, message } = data;

    try {
      // Save the new message to the database
      const newMessage = new Message({
        sender: senderId,
        recipient: recipientId,
        message: message,
      });
      await newMessage.save();

      // Determine the room name
      const room = [senderId, recipientId].sort().join('_');

      // Emit the new message to all clients in the room (including the sender for real-time updates)
      io.to(room).emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Message could not be sent' });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

//routes import
import userRouter from './routes/user.routes.js'
import ngoRouter from './routes/ngo.routes.js'
import reportRouter from './routes/report.routes.js'
import adminRouter from './routes/admin.routes.js'
// //routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/ngos",ngoRouter)
app.use("/api/v1/reports", reportRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/admin", adminRouter)

// http://localhost:8000/api/v1/users/register


export { app,server }

