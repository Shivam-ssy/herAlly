import { useContext } from "react";
import { Link } from "react-router-dom";
import ShowContext from "../context/ShowContext";

function AccessDenied() {
    const {userData} = useContext(ShowContext)
    const getHomeLink = () => {
      if (userData) {
        if (userData.role === "ngo") {
          return "/ngohome";
        } else if (userData.role === "admin") {
          return "/admin/dashboard";
        } else if (userData.role === "user") {
          return "/ngolist";
        }
      }
      return "/";
    };
  return (
    <div className="min-h-screen w-full bg-[#EBF4F6] flex flex-col items-center justify-center px-4">

      {/* Top Illustration Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-4/5 mb-10">
        
        {/* Text Section */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-5xl md:text-7xl font-bold text-red-500">
            Access Denied
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold">
            You don’t have permission to view this page.
          </h2>

          <p className="text-gray-700 text-lg">
            This page is restricted based on user roles.  
            Please go back or choose an allowed section.
          </p>

          <div className="flex gap-4 mt-4">
            <Link
              to={getHomeLink()}
              className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 duration-150"
            >
              Go Home
            </Link>

            <Link
              to="/profile"
              className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 duration-150"
            >
              My Profile
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src="/Designer1.png"
            alt="access denied"
            className="w-96 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Info Cards Section */}
      <section className="w-full flex items-center justify-center py-10 bg-gradient-to-l from-[#DFF2EB] to-[#B9E5E8]">
        <div className="flex md:flex-row flex-col md:gap-0 gap-5 md:items-center md:justify-around md:w-1/2">
          <div className="w-60 bg-white pt-5 rounded-xl border border-yellow-300 hover:shadow hover:shadow-yellow-300 hover:scale-110 duration-150 cursor-default h-44 px-8">
            <h2 className="font-bold text-3xl">Why Restricted?</h2>
            <span>You may not have permission to open this page.</span>
          </div>

          <div className="w-60 bg-white pt-5 rounded-xl border border-yellow-300 hover:shadow hover:shadow-yellow-300 hover:scale-110 duration-150 cursor-default h-44 px-8">
            <h2 className="font-bold text-3xl">Need Access?</h2>
            <span>Contact support or login with the correct account.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccessDenied;
