function MessageCard({ message = "", time = "", isReciever = true }) {
  return (
    <div className={`flex h-fit px-2  w-full ${isReciever?"justify-end":"justify-start"}`}>
        <div className={`text-black rounded-xl shadow shadow-black flex flex-col min-w-60 px-5 py-2  bg-white  `}>
          <div>{message}</div>
          <span className="self-end text-gray-400">{time}</span>
      </div>
    </div>
  );
}

export default MessageCard;
