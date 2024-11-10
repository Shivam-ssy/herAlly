import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useRef, useEffect } from 'react';

function App() {
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollInstance = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.1, // You can customize the scrolling smoothness
    });

    const handleResize = () => {
      scrollInstance.update(); // Update instance on resize
    };
    window.addEventListener("resize", handleResize);

    return () => {
      scrollInstance.destroy(); // Clean up on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  return (
    <>
      <div data-scroll-container ref={scrollRef}>
        <div className='w-full min-h-24'>
          <NavBar />
        </div>
        <Outlet data-scroll-section />
      </div>
    </>
  );
}

export default App;
