import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('receivePreviousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('receivePreviousMessages');
    };
  }, []);

  const sendMessage = () => {
    const data = {
      senderId: 'user-id-1', // Replace with actual user ID
      senderType: 'User', // or 'NGO'
      recipientId: 'ngo-id-1', // Replace with actual recipient ID
      recipientType: 'NGO',
      messageText: message,
      roomName: 'room-1', // Example room, adjust as needed
    };
    socket.emit('sendMessage', data);
    setMessage('');
  };

  const joinRoom = () => {
    socket.emit('joinRoom', 'room-1'); // Join a room (adjust as needed)
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.messageText}</p> // Display each message
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default Chat;
