import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "../Conf/cofig";
function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Initially set to false for mobile menu
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetch(config.getCurrentUser, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      console.log(userData);
      
      if (userData.statusCode === 200) {
        setIsLogin(false)
      
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <main
        className={`fixed top-0  left-0 w-full p-4 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <nav className="flex justify-between items-center md:justify-around">
          <div>
            <div className="flex items-center text-secondary gap-3 font-serif">
              {/* <img className="h-16 rounded-full w-16" src={ "/hero-logo-maker-v3.jpg"} alt="" /> */}
              <div className="pl-10">
                <h3 className="text-3xl pacifico-regular font-bold">
                  her<span className="text-yellow-500">Ally</span>
                </h3>
              </div>
            </div>
          </div>
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } md:block h-screen md:h-auto absolute bg-gray-900 md:bg-transparent text-white md:text-inherit top-24 md:top-auto md:relative md:m-auto right-0 min-w-72 md:w-auto`}
          >
            <ul className="flex flex-col font-bold md:flex-row px-5 py-5 gap-5">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `text-yellow-500` : `hover:text-yellow-500`
                }
              >
                <li className="cursor-pointer ">Home</li>
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? `text-yellow-500` : `hover:text-yellow-500`
                }
              >
                <li className="cursor-pointer">About Us</li>
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive ? `text-yellow-500` : `hover:text-yellow-500`
                }
              >
                <li className="cursor-pointer">Services</li>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? `text-yellow-500` : `hover:text-yellow-500`
                }
              >
                <li className="cursor-pointer">Contact</li>
              </NavLink>
              {
                isLogin && 
              <div className="block  md:hidden gap-5 items-center">
                <Link to="/register">
                  <div className="px-5 py-3 w-full   bg-red-500 rounded-3xl">
                    Sign Up
                  </div>
                </Link>
                <Link to="/login">
                  <div className="px-5 py-3 w-full mt-5 bg-red-500 rounded-3xl">
                    Login
                  </div>
                </Link>
              </div>
              }
              <div className="relative group"></div>
            </ul>
          </div>
          {
            isLogin &&
          <div className="md:flex font-bold hidden gap-5 items-center">
            <Link to="/register">
              <div className="px-5 py-3 bg-red-500 rounded-3xl">Sign Up</div>
            </Link>
            <Link to="/login" className="px-5 py-3 bg-red-500 rounded-3xl">
              Login
            </Link>
          </div>
          }
          <div className="block md:hidden">
            <div onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <i className="text-3xl ri-close-large-line"></i>
              ) : (
                <i className="ri-menu-line text-3xl"></i>
              )}
            </div>
          </div>
        </nav>
      </main>
    </>
  );
}

export default NavBar;
