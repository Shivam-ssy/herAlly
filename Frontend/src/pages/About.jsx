import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Users,
  MessageCircle,
  Lock,
  FileText,
  Heart,
} from "lucide-react";

function About() {
  return (
    <div className="h-fit">
      {/* Hero Section */}
      <section className="h-[80vh] overflow-hidden flex flex-col-reverse md:flex-row items-center justify-end md:justify-center">
        <div className="h-full md:w-1/2 w-full flex items-center justify-end pr-5 bg-[#EBF4F6]">
          <div className="px-8">
            <h2 className="font-bold text-3xl md:text-5xl">
              <span className="text-yellow-500">Empowering Women,</span>
              <br /> Protecting Identities, Building Trust
            </h2>
            <p className="mt-6 text-gray-700 text-lg">
              A safe space for women to seek help anonymously
            </p>
          </div>
        </div>
        <div className="md:w-1/2 bg-[#37B7C3] h-full w-full flex items-center justify-center">
          <div className="text-white text-center p-10">
            <Shield className="w-32 h-32 mx-auto mb-4" />
            <h3 className="text-3xl font-bold">Your Safety, Our Priority</h3>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="min-h-screen py-20 w-full items-center flex justify-center">
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row items-center h-auto md:h-96 gap-10 mb-20">
            <div className="flex gap-8 flex-col w-full md:w-1/2">
              <span className="text-red-500 font-bold text-lg">
                Our Purpose
              </span>
              <h2 className="font-bold text-4xl md:text-5xl">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to unite NGOs and empower women victims to seek
                justice, support, and protect their identity by keeping their
                identity anonymous. This solves the issue of hesitation in women
                due to societal stigma, privacy concerns, and fear of
                retaliation.
              </p>
              <button className="bg-red-500 w-fit text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors">
                Learn More
              </button>
            </div>
            <div className="h-64 md:h-full w-full md:w-auto">
              <div className="bg-gradient-to-br from-[#37B7C3] to-[#088395] rounded-3xl min-w-full md:min-w-96 h-full flex items-center justify-center">
                <Users className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center h-auto md:h-96 gap-10">
            <div className="flex flex-col gap-8 w-full md:w-1/2">
              <span className="text-red-500 font-bold text-lg">Our Dream</span>
              <h2 className="font-bold text-4xl md:text-5xl">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                Our vision is to build a place where women are free from
                violence and fear, where they can report crimes without the fear
                of societal stigma, leading to more crime reports which help
                reduce crime in society.
              </p>
              <button className="bg-red-500 w-fit text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors">
                Join Us
              </button>
            </div>
            <div className="h-64 md:h-full w-full md:w-auto">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl min-w-full md:min-w-96 h-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="md:h-[40vh] md:py-0 py-10 text-white w-full flex items-center justify-center bg-gradient-to-l from-[#DFF2EB] to-[#B9E5E8]">
        <div className="flex text-black md:flex-row flex-col gap-5 md:gap-8 md:items-center md:justify-around md:w-3/4">
          <div className="w-full md:w-60 bg-white pt-5 rounded-xl border hover:shadow-lg hover:shadow-yellow-300 hover:scale-110 duration-150 ease-out cursor-default border-yellow-300 h-44 px-8">
            <h2 className="font-bold text-3xl">7+ NGOs</h2>
            <p className="mt-2 text-gray-600">
              Connected to protect and support you
            </p>
          </div>
          <div className="w-full md:w-60 bg-white pt-5 rounded-xl border hover:shadow-lg hover:shadow-yellow-300 hover:scale-110 duration-150 ease-out cursor-default border-yellow-300 h-44 px-8">
            <h2 className="font-bold text-3xl">100% Anonymous</h2>
            <p className="mt-2 text-gray-600">
              Your identity stays protected always
            </p>
          </div>
          <div className="w-full md:w-60 bg-white pt-5 rounded-xl border hover:shadow-lg hover:shadow-yellow-300 hover:scale-110 duration-150 ease-out cursor-default border-yellow-300 h-44 px-8">
            <h2 className="font-bold text-3xl">24/7 Support</h2>
            <p className="mt-2 text-gray-600">
              We're here whenever you need help
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;