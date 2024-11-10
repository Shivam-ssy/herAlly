import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../Conf/cofig";
function Login() {
  const [stylesChange, setStyleChange] = useState(true);
  const [loading, setloader] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate()
  const handleSubmit=async(e)=>{
    console.log("click");
    
    if(stylesChange){
      await handleUserSubmit(e)
    }
    else {
      await handleNgoSubmit(e)
    }
  }
  
  const handleUserSubmit= async function(e){
    e.preventDefault();
    const hasAccess = await document.hasStorageAccess();
    if (!hasAccess) {
        await document.requestStorageAccess();
    }
    setloader(true);
    console.log(phone,password);
    
const response= await fetch(config.loginUrl,{
 method:'POST',
 credentials:'include',
  headers:{
        'Content-Type':'application/json',
    },
    body:JSON.stringify({
        phone,
        password
    })
})
.finally(()=>setloader(false))
    if(response.status===200){
        const userData=await response.json()                     
        navigate("/ngolist");
    }
    else{
        if(response.status===400) {
            toast.error(" Email is required")
        } 
       else if(response.status===404){
        toast.error("User does not exist")
        }
        else if(response.status===401){
            toast.error("Invalid user credentials")
        }
        else{
            toast.error( "Something went wrong plese try again later")
        }
    }
    
}
  const handleNgoSubmit= async function(e){
    e.preventDefault();
    const hasAccess = await document.hasStorageAccess();
    if (!hasAccess) {
        await document.requestStorageAccess();
    }
    setloader(true);
const response= await fetch(config.loginUrl,{
 method:'POST',
 credentials:'include',
  headers:{
        'Content-Type':'application/json',
    },
    body:JSON.stringify({
        phone,
        password
    })
})
.finally(()=>setloader(false))
console.log(response)
    if(response.status===200){
        const userData=await response.json()                     
        dispatch(authLogin(userData.data.user))
        navigate("/Home");
    }
    else{
        if(response.status===400) {
            toast.error(" Email is required")
        } 
       else if(response.status===404){
        toast.error("User does not exist")
        }
        else if(response.status===401){
            toast.error("Invalid user credentials")
        }
        else{
            toast.error( "Something went wrong plese try again later")
        }
    }
    
}
  return (
    <div data-scroll-section className="h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h3 className="text-4xl font-bold mb-5">Welcome Back!</h3>
      <div>
        <div className={`flex rounded-xl duration-200 ease-in-out overflow-hidden ${!stylesChange?"flex-row-reverse":""}`}>
          <div className={` w-96 flex items-center justify-center bg-cover bg-center ${stylesChange?"bg-[url('/designerLogin.jpg')]":"bg-[url('/login2.jpeg')]"}`}></div>
          <div className="flex min-h-96  flex-col items-center px-10 gap-5">
            <h3 className="text-3xl font-bold">Sign In</h3>
            <div className="flex flex-col gap-5">
              { !stylesChange?
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-mail-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  id="email"
                />
              </div>
                :
                <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-phone-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Phone"
                  type="tel"
                  name="Phone"
                  id="phone"
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                />
              </div>
              }
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-lock-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Password"
                  type="password"
                  name=""
                  id=""
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
            </div>
            <Link className="font-bold">Forget Password?</Link>
            <button onClick={(e)=>handleSubmit(e)} className="px-8 py-3 font-bold rounded-full bg-red-500">
              Sign In
            </button>
            <div>
              Sign In as  {stylesChange ? "NGO" : "Women"} ? {" "}
              <button
                onClick={() => setStyleChange(!stylesChange)}
                className="text-blue-500 font-bold"
              >
                Click Here
              </button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Login;
