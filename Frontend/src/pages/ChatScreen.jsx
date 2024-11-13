import MessageCard from "../components/MessageCard";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import ShowContext from "../context/ShowContext";
import config from "../Conf/cofig";
const socket = io(config.server);

function ChatScreen() {
  const {senderId,recieverId}=useParams()
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {stylesChange,ngoList,userData,connectedUser}=useContext(ShowContext)
  console.log(messages);

  const foundObject = ngoList.length && ngoList.find(item => item._id === recieverId);
  const foundObject2 = connectedUser.length && connectedUser.find(item => item?._id === recieverId);
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default behavior of form submission if applicable
      sendMessage();
    }
  };
  
  useEffect(() => {
    // Join the chat by emitting the `joinChat` event with the sender and recipient IDs
    socket.emit("joinChat", {
      senderId:senderId,
      recipientId: recieverId,
    });

    // Listen for previous messages
    socket.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);
  const date=new Date(Date.now())
  
  const sendMessage = () => {
    const data = {
      senderId: senderId,
      senderType: stylesChange?"Users":"NgoUsers",
      recipientId: recieverId,
      recipientType: !stylesChange?"Users":"NgoUsers",
      message,
      timestamp:date
    };
    socket.emit("sendMessage", data);
    // setMessages((prevMessages) => [...prevMessages, data]);

    setMessage("");
  };
  // const sendMessage = () => {
  //     const data = {
  //       senderId: 'user-id-1', // Replace with actual user ID
  //       senderType: 'User', // or 'NGO'
  //       recipientId: 'ngo-id-1', // Replace with actual recipient ID
  //       recipientType: 'NGO',
  //       messageText: message,
  //       roomName: 'room-1', // Example room, adjust as needed
  //     };
  //     socket.emit('sendMessage', data);
  //     setMessage('');
  //   };

  return (
    <div  className="w-full flex justify-center ">
      <div   className="md:w-1/2 rounded-xl h-[calc(100vh-170px)]  w-full bg-[#edf0f5]">
        <div className="w-full border-2 rounded-xl border-gray-500 py-3">
          <h3 className="font-bold  text-2xl px-5">{foundObject?.name || foundObject2?.name}</h3>
        </div>
        <div className=" relative w-full h-full bg-green-200">
          <div  className="h-full w-full overflow-y-auto  relative">
            <section data-scroll-lock  className="flex message-container h-full overflow-y-auto  relative w-full flex-col justify-end pb-16 gap-5">
              {/* Render Messages */}
              {messages.length>0 &&
                messages.map((data, index) => (
                  <MessageCard key={index} message={data.message} time={data.timestamp} isReciever={userData?._id ==data.sender || userData?._id ==data.senderId?false:true} />
                ))}
            </section>
          </div>
          <div className="w-full flex bg-[#edf0f5] rounded-xl px-3 h-10 absolute bottom-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-full outline-none bg-inherit"
              type="text"
              placeholder="Enter Your Message"
              onKeyDown={handleKeyPress} // Attach the keydown event

            />
            <i
              onClick={sendMessage}
              className="ri-send-plane-line text-xl self-center cursor-pointer"
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
