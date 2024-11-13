function MessageCard({ message = "", time = "", isReciever = true }) {
  const date = new Date(time);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return (
    <div
      className={`flex h-fit px-2  w-full ${
        isReciever ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`text-black rounded-xl shadow shadow-black flex flex-col min-w-60 px-5 py-2  bg-white  `}
      >
        <div>{message}</div>
        <span c className="self-end text-gray-400">
          {hours + ":" + minutes}
        </span>
      </div>
    </div>
  );
}

export default MessageCard;
