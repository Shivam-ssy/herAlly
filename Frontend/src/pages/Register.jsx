import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../Conf/cofig";
function Register() {
  const [stylesChange, setStyleChange] = useState(true);
  const [loader, setloader] = useState(false);
  const [name,setName]=useState("")
  const [details,setDetails]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [uniqueId,setuniqueId]=useState("")
  const [phone,setPhone]=useState("")
  const [state,setState]=useState("")
  const [passwordConfirm,setPasswordConfirm]=useState("")
  const [district,setDistrict]=useState("")
  const handleSubmit=async(e)=>{
    console.log("click");
    if(password.length && password===passwordConfirm){
      if(stylesChange){
        await handleUserSubmit(e)
      }
      else {
        await handleNgoSubmit(e)
      }
    }
    else{
      toast.error("Please match your password")
    }
  }
  
  const handleUserSubmit=  async function(e){
    e.preventDefault();
    if(isStrongPassword(password)){
      setloader(true)
      
      const response =await fetch(config.registerUrl,{
        method:'POST',
        
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          phone,
          password,
        })
      }).finally(()=>setloader(false))
      console.log(response)
      if(response.status===200 || response.status ===201){
        // alert("Register Successfully")
        toast.success("Signup successfull");
      }
      else{
        if(response.status===400){
          toast.error("All fields are required")
        }
        else if(response.status===409){
          toast.error("User with email  already exists")
          console.log(response.message);
        }
        else if(response.status===500){
          toast.error("Something went wrong please try again")
        }
        else{
          toast.error("Something went wrong")
        }
      }
    }
    
    
   
}
  const handleNgoSubmit=  async function(e){
    e.preventDefault();
    if(isStrongPassword(password)){
      setloader(true)
      
      const response =await fetch(config.registerNgoUrl,{
        method:'POST',
        
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          name,email,number:phone,uniqueId,state,district,password,details
        })
      }).finally(()=>setloader(false))
      console.log(response)
      if(response.status===200 || response.status ===201){
        // alert("Register Successfully")
        toast.success("Signup successfull, Registration in queue");
      }
      else{
        if(response.status===400){
          toast.error("All fields are required")
        }
        else if(response.status===409){
          toast.error("User with email  already exists")
          console.log(response.message);
        }
        else if(response.status===500){
          toast.error("Something went wrong please try again")
        }
        else{
          toast.error("Something went wrong")
        }
      }
    }
    
    
   
}
const isStrongPassword=(password)=>{
    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/; 
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/; 
    const specialCharacterRegex = /[!@#$%^&*]/; 
  
    return (
      lengthRegex.test(password) &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharacterRegex.test(password)
    );
  }

const handleNameChange = (e) => {
    const inputName = e.target.value;

    
    if (/[^a-zA-Z\s]/.test(inputName)) {
      
       e.preventDefault();

    } else {
      setName(inputName); 
    }
  };

  
  return (
    <>
    <section data-scroll-section  className="min-h-[calc(100vh-80px)] h-fit w-full flex flex-col justify-center items-center">
    <ToastContainer className={`top-48`} position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h3 className="text-4xl font-bold mb-5">New Registration</h3>
        <div  className={`flex rounded-xl duration-200 ease-in-out overflow-hidden ${!stylesChange?"flex-row-reverse":""}`}>
          <div className={` w-96  bg-cover bg-center ${stylesChange?"bg-[url('/designerLogin.jpg')]":"bg-[url('/login2.jpeg')]"}`}></div>
          <div  className="flex min-h-96  flex-col items-center px-10 gap-5">
            <h3 className="text-3xl font-bold">Sign Up</h3>
            <div className="flex flex-col gap-5">
                {
                    !stylesChange && 
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-user-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="NGO Name"
                  type="text"
                  name="Ngoname"
                  id="ngoname"
                  value={name}
                  onChange={(e)=>handleNameChange(e)}
                />
              </div>
                }
                {
                    !stylesChange && 
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-mail-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Email"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
                }
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-phone-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Phone"
                  type="tel"
                  name="phone"
                  id="phone"
                  max={10}
                  required
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                />
              </div>
              {
                    !stylesChange && 
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-mail-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Unique Registration Number"
                  type="text"
                  name="uniqueId"
                  id="uniqueId"
                  value={uniqueId}
                  required
                  onChange={(e)=>setuniqueId(e.target.value)}
                />
              </div>
                }
              {
                    !stylesChange && 
                    <div className="flex w-full justify-between">
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <input
                  className="outline-none h-full rounded-xl w-40 px-5"
                  placeholder="Enter State"
                  type="text"
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e)=>setState(e.target.value)}

                />
              </div>
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <input
                  className="outline-none h-full rounded-xl w-40 px-5"
                  placeholder="Enter District"
                  type="text"
                  name="district"
                  id="district"
                  value={district}
                  onChange={(e)=>setDistrict(e.target.value)}
                />
              </div>

                    </div>
                }
                {
                  !stylesChange &&
                  <div className="flex border items-center border-gray-600 rounded-xl h-12">
                  <i class="ri-lock-line text-2xl"></i>
                  <input
                    className="outline-none h-full rounded-xl w-80 px-5"
                    placeholder="Major Field you cover"
                    type="text"
                    name="details"
                    id="details"
                    value={details}
                    onChange={(e)=>setDetails(e.target.value)}
                  />
                </div>
                }
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-lock-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Password"
                  type="password"
                  name="passoword"
                  id="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-lock-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassoword"
                  id="confirmPassword"
                  value={passwordConfirm}
                  onChange={(e)=>setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="px-8 py-3 font-bold rounded-full bg-red-500">
              Sign Up
            </button>
            <div>
              Sign Up as  {stylesChange ? "NGO" : "Women"} ? {" "}
              <button
                onClick={() => setStyleChange(!stylesChange)}
                className="text-blue-500 font-bold"
              >
                Click Here
              </button>
            </div>
          </div>
        </div>
        <div  className="h-50"></div>
      </section>
      <section  data-scroll-section   className="h-32"></section>
    </>
  );
}

export default Register;
