import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/apiServices';
import ShowContext from '../context/ShowContext';
import { toast } from 'react-toastify';
 const ngodData = {
    name: 'Women Empowerment Foundation',
    uniqueId: 'NGO12345',
    state: 'Delhi',
    district: 'Central Delhi',
    address: '123 Main Street, Connaught Place, New Delhi - 110001',
    email: 'contact@womenempowerment.org',
    phone: '+91 9876543210',
    helpline: '1800-123-4567',
    website: 'www.womenempowerment.org',
    description: 'Women Empowerment Foundation is dedicated to providing comprehensive support, legal aid, counseling, and rehabilitation services to women in distress. We work tirelessly to create a safe space for women to report crimes and seek justice without fear.',
    services: [
      '24/7 Emergency Helpline',
      'Legal Aid & Counseling',
      'Shelter & Rehabilitation',
      'Medical Assistance',
      'Police Complaint Support',
      'Skill Development Programs'
    ],
    workingHours: 'Monday - Sunday: 24/7',
    teamSize: '50+ Volunteers',
    casesHandled: '500+',
    successRate: '85%',
    isVerified: true,
    rating: 4.8,
    reviews: 127
  };
function NGODetails() {
  const navigate = useNavigate();
  const {userData} = useContext(ShowContext)
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [ngoData, setNgoData] = useState(null);
  const params = useParams();
  const ngoId = params.ngoId;
  const [loading, setLoading] = useState({
    page: false,
    report: false,
    chat: false
  });
  const [reportData, setReportData] = useState({
    type: '',
    description: '',
    location: '',
    urgency: 'medium'
  });
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ngo', message: 'Hello! How can we help you today?', time: '10:30 AM' }
  ]);

  // Mock NGO data - Replace with actual data from props or API
 
  const fetchNgoDetails = async () => {
    // Implement API call to fetch NGO details by ID
    try {
      const response = await ApiService.getNgoById(ngoId);
      // console.log("response", response);
      
      if (response.data.data) {
        setNgoData(response.data.data);
      }
    } catch (error) {
      console.log("Error", error);
      
    }
    setLoading(prev => ({...prev, page: false}));
  }
  useEffect(() => {
    setLoading(prev => ({...prev, page: true}));
    fetchNgoDetails();
  }, []);
  const handleReportSubmit = async() => {
    if (!reportData.type || !reportData.description || !reportData.location) {
      toast.error('Please fill all required fields!');
      return;
    }
    // Add your API call here to submit the report
    // console.log('Report submitted:', reportData);
    try {
      setLoading(prev => ({...prev, report: true}));
      await ApiService.createReport({...reportData, toReportedNgo : ngoData._id});
      toast.success('Your report has been submitted successfully. An NGO representative will contact you soon.');
      setShowReportModal(false);
      setReportData({ type: '', description: '', location: '', urgency: 'medium' });
    } catch (error) {
      console.log("submit error",error);
      
      toast.error('Failed to submit the report. Please try again.');
    } finally {
      setLoading(prev => ({...prev, report: false}));
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
    
    // Simulate NGO response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        sender: 'ngo',
        message: 'Thank you for reaching out. Our team will review your message and respond shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };
  if (loading.page || !ngoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBF4F6] via-[#B9E5E8] to-[#DFF2EB]">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF4F6] via-[#B9E5E8] to-[#DFF2EB]">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#37B7C3] to-[#088395] py-12 px-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => window.history.back()} 
            className="text-white hover:text-yellow-300 mb-6 inline-flex items-center gap-2 text-lg transition-colors"
          >
            <span className="text-2xl">←</span> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {ngoData.name}
                </h1>
                {ngoData.isVerified && (
                  <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white text-lg">
                <span className="flex items-center gap-2">
                  ⭐ {ngoData.rating} ({ngoData.reviews} reviews)
                </span>
                <span>•</span>
                <span>ID: {ngoData.ngoDetails?.uniqueId}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                🚨 Report Incident
              </button>
              <button
                onClick={() => navigate(`/chatscreen/${userData?._id}/${ngoData._id}`)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                💬 Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 transition-all duration-300">
              <span className="text-red-500 font-bold text-sm uppercase tracking-wide">About</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Organization Overview</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {ngoData?.ngoDetails?.overview}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 transition-all duration-300">
              <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Services</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {ngoData?.ngoDetails?.services?.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 bg-gradient-to-r from-[#EBF4F6] to-[#DFF2EB] p-4 rounded-xl hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-2xl">✓</span>
                    <span className="font-medium text-gray-800">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#37B7C3] to-[#088395] rounded-3xl shadow-xl p-6 text-white">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold">{ngoData.ngoDetails?.statistics?.volunteers}</div>
                <div className="text-sm opacity-90">Team Members</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-xl p-6 text-gray-800">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-bold">{ngoData.ngoDetails?.statistics?.casesHandled}</div>
                <div className="text-sm opacity-90">Cases Handled</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl shadow-xl p-6 text-white">
                <div className="text-4xl mb-2">✓</div>
                <div className="text-3xl font-bold">{ngoData.ngoDetails?.statistics?.successRate}</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 transition-all duration-300 sticky top-6">
              <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Contact</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-bold text-gray-800">Address</p>
                    <p className="text-gray-600 text-sm">{`${ngoData.ngoDetails?.address?.street ||""} ${ngoData.ngoDetails?.address?.area}, ${ngoData.ngoDetails?.address?.city},  - ${ngoData.ngoDetails?.address?.pincode ||""}`}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold text-gray-800">Phone</p>
                    <p className="text-gray-600 text-sm">{ngoData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🆘</span>
                  <div>
                    <p className="font-bold text-gray-800">24/7 Helpline</p>
                    <p className="text-red-500 font-bold text-lg">{ngoData.helpline}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-bold text-gray-800">Email</p>
                    <p className="text-gray-600 text-sm">{ngoData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <p className="font-bold text-gray-800">Website</p>
                    <p className="text-blue-600 text-sm">{ngoData.website}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-bold text-gray-800">Working Hours</p>
                    <p className="text-gray-600 text-sm">{ngoData.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-700 text-center">
                    🔒 <span className="font-bold">Your identity is protected.</span> All reports are anonymous and confidential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">🚨 Report Incident</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-white hover:text-gray-200 text-3xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white opacity-90 mt-2">Your identity will remain anonymous</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-red-500 mb-2">Type of Incident *</label>
                <select
                  value={reportData.type}
                  onChange={(e) => setReportData({ ...reportData, type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                >
                  <option value="">Select type...</option>
                  <option value="domestic_violence">Domestic Violence</option>
                  <option value="harassment">Harassment</option>
                  <option value="assault">Physical Assault</option>
                  <option value="stalking">Stalking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-red-500 mb-2">Description *</label>
                <textarea
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none h-32 resize-none"
                  placeholder="Please describe the incident..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-red-500 mb-2">Location *</label>
                <input
                  type="text"
                  value={reportData.location}
                  onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                  placeholder="Where did this happen?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-red-500 mb-2">Urgency Level</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      onClick={() => setReportData({ ...reportData, urgency: level })}
                      className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all ${
                        reportData.urgency === level
                          ? level === 'high' ? 'bg-red-500 text-white' 
                            : level === 'medium' ? 'bg-yellow-400 text-gray-800'
                            : 'bg-green-400 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleReportSubmit}
                  disabled={loading.report}
                  className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all ${loading.report ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                 { loading.report ? 'Submitting...' : 'Submit Report' }
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-[#37B7C3] to-[#088395] p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">💬 Chat with {ngoData.name}</h2>
                <p className="text-white opacity-90 text-sm">We typically reply within minutes</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white hover:text-gray-200 text-3xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {chatHistory?.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    chat.sender === 'user'
                      ? 'bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-800'
                  } px-4 py-3 rounded-2xl shadow`}>
                    <p>{chat.message}</p>
                    <p className={`text-xs mt-1 ${
                      chat.sender === 'user' ? 'text-white opacity-70' : 'text-gray-500'
                    }`}>
                      {chat.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t-2 border-gray-200 rounded-b-3xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NGODetails;