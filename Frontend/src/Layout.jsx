import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useRef, useEffect,useContext } from 'react';
import ShowContext from './context/ShowContext';
import Loader from './components/Loader';

function Layout() {
  const location = useLocation();
  const scrollRef = useRef(null);
  const {loader}=useContext(ShowContext)
  useEffect(() => {
    const scrollInstance = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.1, // Customizes scrolling smoothness
    });

    const handleResize = () => {
      scrollInstance.update(); // Updates Locomotive Scroll on resize
    };
    window.addEventListener("resize", handleResize);

    // Function to enable data-scroll-lock for a specific section (e.g., chat)
    const enableNativeScroll = () => {
      const lockedSection = scrollRef.current.querySelector('[data-scroll-lock]');
      if (lockedSection) {
        lockedSection.style.overflowY = 'auto'; // Allows native scrolling
        scrollInstance.stop(); // Temporarily stops Locomotive Scroll
      }
    };

    enableNativeScroll(); // Call the function to enable scrolling for the section

    return () => {
      scrollInstance.destroy(); // Cleans up Locomotive Scroll instance
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  return (
    <>
    
      <div data-scroll-container ref={scrollRef}>
        <div className='w-full min-h-24'>
          <NavBar />
        </div>
        {
          loader? <Loader/>:
        <Outlet data-scroll-section />
        }
      </div>
    </>
  );
}

export default Layout;
