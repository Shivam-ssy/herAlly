import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, TrendingUp, Users, FileText, AlertCircle } from 'lucide-react';
import ApiService from '../services/apiServices';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    verificationRate: 0
  });
  
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve', 'reject', or 'revoke'
  const [uniqueId, setUniqueId] = useState('');
  const [reason, setReason] = useState('');

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await ApiService.getVerificationStats()
      console.log("fetch stats ",response.data);
      
      if (response.status === 200) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch NGOs based on status
  const fetchNgos = async (status) => {
    setLoading(true);
    try {
      const response = await ApiService.getNgoForAdmin(status);
      if (response.status === 200) {
        setNgos(response.data.data);
        setFilteredNgos(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchNgos(activeTab);
  }, [activeTab]);

  // Search filter
  useEffect(() => {
    const filtered = ngos.filter(ngo => 
      ngo.ngoDetails?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.ngoDetails?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNgos(filtered);
  }, [searchTerm, ngos]);

  // Close modal and reset
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedNgo(null);
    setUniqueId('');
    setReason('');
  };

  // Approve NGO
  const handleApprove = async () => {
    try {
      const response = await ApiService.verifyNGO(selectedNgo._id, { uniqueId });
      if (response.status === 200) {
        toast.success('NGO approved successfully!');
        closeModal();
        fetchNgos(activeTab);
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving NGO:', error);
      toast.error('Failed to approve NGO');
    }
  };

  // Reject NGO
  const handleReject = async () => {
    try {
      const response = await ApiService.rejectNGO(selectedNgo._id, { reason });
      if (response.status === 200) {
        toast.success('NGO rejected successfully!');
        closeModal();
        fetchNgos(activeTab);
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting NGO:', error);
      toast.error('Failed to reject NGO');
    }
  };

  // Revoke verification
  const handleRevoke = async () => {
    try {
      const response = await ApiService.revokeNGOVerification(selectedNgo._id, { reason });
      if (response.status === 200) {
        toast.success('Verification revoked successfully!');
        closeModal();
        fetchNgos(activeTab);
        fetchStats();
      }
    } catch (error) {
      console.error('Error revoking verification:', error);
      toast.error('Failed to revoke verification');
    }
  };

  // Handle modal submission
  const handleModalSubmit = () => {
    if (modalType === 'approve') {
      handleApprove();
    } else if (modalType === 'reject') {
      handleReject();
    } else if (modalType === 'revoke') {
      handleRevoke();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NGO Verification Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and verify NGO registrations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total NGOs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Verified NGOs</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.verified}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Verification Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.verificationRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'pending'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'verified'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Verified ({stats.verified})
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by organization name, state, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* NGO List */}
          <div className="divide-y">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredNgos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No NGOs found</div>
            ) : (
              filteredNgos.map((ngo) => (
                <div key={ngo._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ngo.name || 'N/A'}
                        </h3>
                        {ngo.ngoDetails?.isVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                        {ngo.ngoDetails?.uniqueId && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            ID: {ngo.ngoDetails.uniqueId}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Contact:</span> {ngo.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {ngo.email || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {ngo.phone}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {ngo.ngoDetails?.state || 'N/A'}, {ngo.ngoDetails?.district || 'N/A'}
                        </div>
                      </div>

                      {ngo.ngoDetails?.overview && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {ngo.ngoDetails.overview}
                        </p>
                      )}

                      {ngo.ngoDetails?.services && ngo.ngoDetails.services.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ngo.ngoDetails.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {service}
                            </span>
                          ))}
                          {ngo.ngoDetails.services.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{ngo.ngoDetails.services.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      {!ngo.ngoDetails?.isVerified ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedNgo(ngo);
                              setModalType('approve');
                              setShowModal(true);
                            }}
                            className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNgo(ngo);
                              setModalType('reject');
                              setShowModal(true);
                            }}
                            className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedNgo(ngo);
                            setModalType('revoke');
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'approve' && 'Approve NGO'}
              {modalType === 'reject' && 'Reject NGO'}
              {modalType === 'revoke' && 'Revoke Verification'}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {modalType === 'approve' && 'Approving: '}
              {modalType === 'reject' && 'Rejecting: '}
              {modalType === 'revoke' && 'Revoking verification for: '}
              <span className="font-semibold">{selectedNgo?.ngoDetails?.organizationName}</span>
            </p>
            
            {modalType === 'approve' && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Unique ID (Optional)
                </label>
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="e.g., NGO-2024-001"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                />
              </>
            )}

            {(modalType === 'reject' || modalType === 'revoke') && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for this action..."
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
                />
              </>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleModalSubmit}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  modalType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : modalType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {modalType === 'approve' && 'Confirm Approval'}
                {modalType === 'reject' && 'Confirm Rejection'}
                {modalType === 'revoke' && 'Confirm Revoke'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;