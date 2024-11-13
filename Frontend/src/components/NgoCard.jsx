import { useNavigate } from "react-router-dom"
function NgoCard({title="",image="",user ,id,bg="bg-white", details="",className="",time="Not sure"}) {
  const navigate=useNavigate()

  return (
    <div onClick={()=>navigate(`/chatscreen/${user}/${id}`)} className={`flex duration-150 ease-in-out hover:scale-105 shadow shadow-black h-fit  flex-col cursor-pointer bg-[#EBF4F6] justify-center rounded-2xl p-5 w-80 md:w-96  `}>
    <div className=' px-5  mb-5  rounded-2xl'><img className=' rounded-2xl w-full' src={image} alt="" /></div>
    <h2 className='font-bold text-2xl'>{title}</h2>
    <div className=' '>Details : {details}</div>
    {/* <span>Time Joined: {time}</span> */}
  </div>
  )
}

export default NgoCard;
