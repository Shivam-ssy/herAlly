import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useRef, useEffect, useContext } from 'react';
import ShowContext from './context/ShowContext';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const scrollRef = useRef(null);
  const { loader } = useContext(ShowContext)
  // useEffect(() => {
  //   const scrollInstance = new LocomotiveScroll({
  //     el: scrollRef.current,
  //     smooth: true,
  //     lerp: 0.1, // Customizes scrolling smoothness
  //   });

  //   const handleResize = () => {
  //     scrollInstance.update(); // Updates Locomotive Scroll on resize
  //   };
  //   window.addEventListener("resize", handleResize);

  //   // Function to enable data-scroll-lock for a specific section (e.g., chat)
  //   const enableNativeScroll = () => {
  //     const lockedSection = scrollRef.current.querySelector('[data-scroll-lock]');
  //     if (lockedSection) {
  //       lockedSection.style.overflowY = 'auto'; // Allows native scrolling
  //       scrollInstance.stop(); // Temporarily stops Locomotive Scroll
  //     }
  //   };

  //   enableNativeScroll(); // Call the function to enable scrolling for the section

  //   return () => {
  //     scrollInstance.destroy(); // Cleans up Locomotive Scroll instance
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [location]);
  // data-scroll-container ref={scrollRef}
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen flex flex-col">

        {/* Navbar */}
        <div className="w-full min-h-24">
          <NavBar />
        </div>

        {/* Main Content */}
        <main className="flex-grow">
          {loader ? <Loader /> : <Outlet />}
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </>
  );
}

export default App;
