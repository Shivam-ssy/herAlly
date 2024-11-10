import MessageCard from "../components/MessageCard"

function ChatScreen() {
  return (
    <div data-scroll-section className="w-full flex justify-center ">
        <div data-scroll-section className="md:w-1/2 rounded-xl h-[calc(100vh-150px)]  w-full bg-[#edf0f5]">
            <div className="w-full border-2 rounded-xl border-gray-500 py-3">
                <h3 className="font-bold  text-2xl px-5">Jagori</h3>
            </div>
            <div className="message-container relative w-full h-full  bg-green-200">
                <div className="flex h-full flex-col justify-end pb-16 gap-5">
                <MessageCard message="hello" time="4am" isReciever={false} />
                <MessageCard message="hello" time="4:01am" isReciever={true}/>
                </div>
                <div className="w-full flex bg-[#edf0f5] rounded-xl px-3 h-10  absolute bottom-2 ">
                    <input className="w-full h-full bg-inherit" type="text" />
                    <i class="ri-send-plane-line text-xl self-center"></i>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default ChatScreen
