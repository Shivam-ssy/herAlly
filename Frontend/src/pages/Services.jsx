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
function Services() {
  const services = [
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Anonymous Reporting',
      description: 'Report incidents without revealing personal details. Your identity is protected with a unique case ID.',
      color: 'from-[#37B7C3] to-[#088395]'
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: 'Secure Communication',
      description: 'Communicate with verified NGOs through encrypted channels. Share only what you choose to share.',
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Online Counselling',
      description: 'Access professional counselling services anonymously. Get the emotional support you need.',
      color: 'from-red-400 to-red-500'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Legal Assistance',
      description: 'Get legal advice and support from experts. Understand your rights and options.',
      color: 'from-green-400 to-green-500'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'NGO Verification',
      description: 'All NGOs are verified and rated. Connect with genuine organizations that can help.',
      color: 'from-purple-400 to-purple-500'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Ongoing Support',
      description: 'Receive consistent feedback and updates on your case progress through our platform.',
      color: 'from-pink-400 to-pink-500'
    }
  ];

  return (
    <div className="h-fit">
      {/* Hero Section */}
      <section className="h-[80vh] overflow-hidden flex flex-col-reverse md:flex-row items-center justify-end md:justify-center">
        <div className="h-full md:w-1/2 w-full flex items-center justify-end pr-5 bg-[#EBF4F6]">
          <div className="px-8">
            <h2 className="font-bold text-3xl md:text-5xl">
              <span className="text-yellow-500">Comprehensive Support,</span>
              <br /> Complete Privacy, Total Security
            </h2>
            <p className="mt-6 text-gray-700 text-lg">
              Everything you need to seek help safely
            </p>
          </div>
        </div>
        <div className="md:w-1/2 bg-[#37B7C3] h-full w-full flex items-center justify-center">
          <div className="text-white text-center p-10">
            <MessageCircle className="w-32 h-32 mx-auto mb-4" />
            <h3 className="text-3xl font-bold">We're Here to Help</h3>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="min-h-screen py-20 w-full flex justify-center">
        <div className="md:w-3/4 w-full px-4">
          <div className="text-center mb-16">
            <span className="text-red-500 font-bold text-lg">What We Offer</span>
            <h2 className="font-bold text-4xl md:text-5xl mt-4">Our Services</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              A complete suite of services designed to support and protect women in need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6`}>
                  {service.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-l from-[#DFF2EB] to-[#B9E5E8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-red-500 font-bold text-lg">Simple Process</span>
            <h2 className="font-bold text-4xl md:text-5xl mt-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create an account securely' },
              { step: '02', title: 'Choose NGO', desc: 'Select from verified NGOs' },
              { step: '03', title: 'Report Safely', desc: 'Share your concern anonymously' },
              { step: '04', title: 'Get Support', desc: 'Receive help and guidance' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-yellow-400 text-white font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services