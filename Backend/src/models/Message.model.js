import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    enum: ['Users', 'NgoUsers'],
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType', // Dynamic reference based on senderType
  },
  recipientType: {
    type: String,
    enum: ['Users', 'NgoUsers'],
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientType', // Dynamic reference based on recipientType
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message= mongoose.model('Message', MessageSchema);
export {Message}
