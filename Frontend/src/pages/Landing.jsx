import { Link } from "react-router-dom";
function Landing() {
  return (
    <div className="h-fit">
      <section
        className="h-[80vh] overflow-hidden flex flex-col-reverse md:flex-row items-center justify-end md:justify-center"
        data-scroll-section
      >
        <div className="h-full md:w-1/2 w-full flex items-center justify-end pr-5   bg-[#EBF4F6]">
          <div className="">
            <h2 className="font-bold text-3xl md:text-5xl">
              <span className="text-yellow-500">Silent Support,</span>
              <br /> Stronger Together, Fighting for <br /> Women’s Rights
            </h2>
          </div>
        </div>

        <div className="md:w-1/2 bg-[#37B7C3] h-full w-full">
          <div className="md:self-end self-start">
            <img className="w-96" src="/Designer1.png" alt="hero image" />
          </div>
        </div>
      </section>

     
      <section  className="min-h-screen py-10 w-full items-center flex justify-center" data-scroll-section>
        <div className="md:w-3/4">
            <div className="flex items-center h-96 gap-10">
              <div className="flex gap-8 flex-col  w-1/2">
              <span className="text-red-500 font-bold">About Us</span>
              <h2 className="font-bold text-5xl">Our Mission</h2>
              <span>Our Mission is to unite NGOs and empowering women victims to seek justice, support and protect their identity by keeping their identity anonymous. This will solve the issue of hesitation due in women, due to society stigma, privacy concerns and fear of retaliation</span>
              <Link className="bg-red-500 w-fit text-white px-8 py-3 rounded-full">Learn More</Link>
              </div>
              <div className="h-full">
                <img className=" bg-green-400 rounded-3xl min-w-96 h-full" src="/hero-image.png" alt="" />
              </div>
            </div>
            <div className="flex gap-10 h-96 items-center">
              <div className="h-full"><img className="bg-green-400 rounded-3xl min-w-96 h-full" src="/hero-image.png" alt="" /></div>
              <div className="flex flex-col gap-8 w-1/2">
              <span className="text-red-500 font-bold">What we Do</span>
              <h2 className="font-bold text-5xl">Our Vision</h2>
              <span>Our vision is to build a place where women free from violence and fear, they can report crime without the fear of society stigma leading to more crime report which help to reduce crime in society.</span>
              <Link className="bg-red-500 w-fit text-white px-8 py-3 rounded-full">Learn More</Link>

              </div>
            </div>
        </div>
      </section>
       <section
        className="md:h-[40vh] md:py-0 py-10  text-white w-full flex items-center justify-center bg-gradient-to-l from-[#DFF2EB] to-[#B9E5E8]"
        data-scroll-section
      >
        <div className="flex text-black md:flex-row flex-col gap-5 md:gap-0 md:items-center md:justify-around md:w-1/2">
          <div className="w-60 bg-white pt-5 rounded-xl  border hover:shadow hover:shadow-yellow-300 hover:scale-110 duration-150 ease-out cursor-default border-yellow-300 h-44 px-8">
            <h2 className="font-bold text-3xl">Number of NGO's</h2>
            <span>We Have connected to 7 To Protect You</span>
          </div>
          <div className="w-60 bg-white pt-5 rounded-xl border hover:shadow hover:shadow-yellow-300 hover:scale-110 duration-150 ease-out cursor-default border-yellow-300 h-44 px-8">
            <h2 className="font-bold text-3xl">Number of cities In</h2>
            <span>
              We have covered NGO's across every street of Delhi
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Landing;
