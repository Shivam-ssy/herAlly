import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Register() {
  const [stylesChange, setStyleChange] = useState(true);

  
  return (
    <>
    <section data-scroll-section  className="min-h-[calc(100vh-80px)] h-fit w-full flex flex-col justify-center items-center">
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                  name=""
                  id=""
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
                  name=""
                  id=""
                />
              </div>
                }
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-phone-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Phone"
                  type="tel"
                  name=""
                  id=""
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
                  name=""
                  id=""
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
                  name=""
                  id=""
                />
              </div>
                    <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <input
                  className="outline-none h-full rounded-xl w-40 px-5"
                  placeholder="Enter District"
                  type="text"
                  name=""
                  id=""
                />
              </div>

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
                />
              </div>
              <div className="flex border items-center border-gray-600 rounded-xl h-12">
                <i class="ri-lock-line text-2xl"></i>
                <input
                  className="outline-none h-full rounded-xl w-80 px-5"
                  placeholder="Confirm Password"
                  type="password"
                  name=""
                  id=""
                />
              </div>
            </div>
            <button onClick={()=>toast.success("Registration Successfull. Request added to Queue")} className="px-8 py-3 font-bold rounded-full bg-red-500">
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
