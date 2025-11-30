import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import ShowContext from "../context/ShowContext";
import config from "../Conf/cofig";
import MessageCard from "../components/MessageCard";

function ChatScreen() {
  const { senderId, recieverId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { ngoList, userData, connectedUser } = useContext(ShowContext);

  // ---------- INIT SOCKET CORRECTLY ----------
  useEffect(() => {
    const newSocket = io(config.server, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // ---------- JOIN CHAT & LISTEN TO EVENTS ----------
  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit("joinChat", {
      senderId,
      recipientId: recieverId,
    });

    // Listen for old messages
    socket.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, [socket]);

  // ---------- SEND MESSAGE ----------
  const sendMessage = () => {
    if (!socket || message.trim() === "") return;

    socket.emit("sendMessage", {
      senderId,
      recipientId: recieverId,
      message,
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ---------- FIND CHAT NAME ----------
  const foundObject = ngoList?.find((item) => item._id === recieverId);
  const foundObject2 = connectedUser?.find((item) => item?._id === recieverId);

  return (
    <div className="w-full flex justify-center">
      <div className="md:w-1/2 rounded-xl h-[calc(100vh-170px)] w-full bg-[#edf0f5]">
        
        {/* Header */}
        <div className="w-full flex items-center border-2 rounded-xl border-gray-500 py-3">
          <button
            onClick={() => window.history.back()}
            className="hover:text-yellow-300 pl-5 inline-flex items-center gap-2 text-lg transition-colors"
          >
            <span className="text-2xl">←</span> Back
          </button>
          <h3 className="font-bold text-2xl px-5">
            {foundObject?.name || foundObject2?.name}
          </h3>
        </div>

        {/* Chat Messages */}
        <div className="relative w-full h-full bg-green-200">
          <div className="h-full w-full overflow-y-auto relative">
            <section className="flex message-container h-full overflow-y-auto relative w-full flex-col justify-end pb-16 gap-5">
              {messages.map((data, index) => (
                <MessageCard
                  key={index}
                  message={data.message}
                  time={data.timestamp}
                  isReciever={
                    userData?._id === data.sender || userData?._id === data.senderId
                      ? false
                      : true
                  }
                />
              ))}
            </section>
          </div>

          {/* Message Input */}
          <div className="w-full flex bg-[#edf0f5] rounded-xl px-3 h-10 absolute bottom-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full h-full outline-none bg-inherit"
              type="text"
              placeholder="Enter Your Message"
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
