import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType', // Dynamic reference based on senderType
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
