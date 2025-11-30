import { useState, useContext, createContext } from 'react';
import ShowContext from '../context/ShowContext';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../services/apiServices';

// Mock Auth Context - Replace with your actual context
const AuthContext = createContext();

// Mock Provider - Remove this and use your actual AuthContext
const MockAuthProvider = ({ children }) => {
    const [user] = useState({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+91 9876543210',
        role: 'ngo', // Change to 'user' or 'ngo' to test
        ngoDetails: {
            uniqueId: 'NGO12345',
            state: 'Delhi',
            district: 'New Delhi',
            address: {
                street: '123 Main Street',
                area: 'Connaught Place',
                city: 'New Delhi',
                pincode: '110001'
            },
            organizationName: 'Women Empowerment Foundation',
            overview: 'Women Empowerment Foundation is dedicated to providing comprehensive support, legal aid, counseling, and rehabilitation services to women in distress. We work tirelessly to create a safe space for women to report crimes and seek justice without fear.',
            contactInfo: {
                phone: '+91 9876543210',
                helpline: '1800-123-4567',
                email: 'contact@womenempowerment.org',
                website: 'www.womenempowerment.org',
                workingHours: 'Monday - Sunday: 24/7'
            },
            services: [
                '24/7 Emergency Helpline',
                'Legal Aid & Counseling',
                'Shelter & Rehabilitation',
                'Medical Assistance',
                'Police Complaint Support',
                'Skill Development Programs'
            ],
            statistics: {
                volunteers: 50,
                casesHandled: 500,
                successRate: 85
            },
            isVerified: true,
            verificationDocuments: []
        }
    });

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

function Profile() {
    const { user } = useContext(ShowContext);
    const [passwordStrength, setPasswordStrength] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({ ...user });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData({ ...user });
        }
        setIsEditing(!isEditing);
    };
    const getStrengthColor = () => {
        if (passwordStrength === "Strong") return "text-green-500";
        if (passwordStrength === "Medium") return "text-yellow-500";
        return "text-red-500";
    };
    const checkPasswordStrength = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password),
        };

        const strength = Object.values(checks).filter(Boolean).length;

        if (strength === 5) setPasswordStrength("Strong");
        else if (strength >= 3) setPasswordStrength("Medium");
        else setPasswordStrength("Weak");

        return checks;
    };

    // Validate password strength
    const isStrongPassword = (password) => {
        const checks = checkPasswordStrength(password);
        return Object.values(checks).every(Boolean);
    };
    const handleSaveProfile = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add your actual API call here
        console.log('Saving profile:', editData);

        setLoading(false);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('Please fill all password fields!');
            return;
        }
        if (!isStrongPassword(passwordData.newPassword)) {
            toast.error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!');
            return;
        }

        setLoading(true);
        try {

            await ApiService.changePassword({ oldPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
            toast.success('Password changed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 1500));
        // Add your actual API call here
        console.log('Changing password');

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsChangingPassword(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EBF4F6] via-[#B9E5E8] to-[#DFF2EB]">
            {/* <ToastContainer
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
            /> */}
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-[#37B7C3] to-[#088395] py-12 px-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                                {user?.role === 'ngo' ? 'NGO Profile' : 'My Profile'}
                            </h1>
                            <p className="text-white text-lg opacity-90">
                                {user?.role === 'ngo' ? 'Organization Dashboard' : 'Manage your account settings'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-5 py-12">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 hover:scale-[1.02] transition-all duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Personal Info</span>
                                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                                    {user?.role === 'ngo' ? 'Organization Details' : 'Your Information'}
                                </h2>
                            </div>
                            {/* {user.role !== 'user' && <button
                                onClick={handleEditToggle}
                                className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                {isEditing ? '✕ Cancel' : '✎ Edit'}
                            </button>} */}
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className=" text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                    <span className="text-lg">👤</span> Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">{user?.name}</p>
                                )}
                            </div>

                            {user.email && <div className="group">
                                <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                    <span className="text-lg">✉️</span> Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">{user?.email}</p>
                                )}
                            </div>}

                            <div className="group">
                                <label className=" text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                    <span className="text-lg">📱</span> Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">{user?.phone}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                    <span className="text-lg">🏷️</span> Role
                                </label>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-gray-800 font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-3 rounded-xl capitalize inline-block">
                                        {user?.role}
                                    </p>
                                    {user?.role === 'ngo' && user?.ngoDetails?.isVerified && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="mt-8 w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⟳</span> Saving...
                                    </span>
                                ) : (
                                    '💾 Save Changes'
                                )}
                            </button>
                        )}
                    </div>

                    {/* NGO Details Card (Only for NGO users) */}
                    {user?.role === 'ngo' && user?.ngoDetails && (
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 hover:scale-[1.02] transition-all duration-300">
                            <div className="mb-8">
                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">NGO Information</span>
                                <h2 className="text-3xl font-bold text-gray-800 mt-2">Organization Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">🏢</span> Organization Name
                                    </label>
                                    <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                                        {user.ngoDetails.organizationName}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">🆔</span> Unique ID
                                    </label>
                                    <p className="text-lg text-gray-800 font-mono font-medium bg-gray-50 px-4 py-3 rounded-xl">
                                        {user.ngoDetails.uniqueId}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">📝</span> Overview
                                    </label>
                                    <p className="text-base text-gray-700 bg-gray-50 px-4 py-4 rounded-xl leading-relaxed">
                                        {user.ngoDetails.overview}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">📍</span> Address
                                    </label>
                                    <p className="text-base text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                                        {user.ngoDetails.address?.street}, {user.ngoDetails.address?.area}<br />
                                        {user.ngoDetails.address?.city}, {user.ngoDetails.state} - {user.ngoDetails.address?.pincode}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">✓</span> Verification Status
                                    </label>
                                    <div className={`px-4 py-3 rounded-xl font-bold ${user.ngoDetails.isVerified
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {user.ngoDetails.isVerified
                                            ? '✓ Verified Organization'
                                            : '⏳ Pending Verification'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Change Password Card */}
                    <div className={`bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 hover:scale-[1.02] transition-all duration-300 ${user?.role === 'ngo' ? '' : 'md:col-span-2'}`}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Security</span>
                                <h2 className="text-3xl font-bold text-gray-800 mt-2">Change Password</h2>
                            </div>
                            {!isChangingPassword && (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    🔒 Change
                                </button>
                            )}
                        </div>

                        {isChangingPassword ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">🔐</span> Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">🔑</span> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => { setPasswordData({ ...passwordData, newPassword: e.target.value }); checkPasswordStrength(e.target.value); }}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                        placeholder="Enter new password"
                                    />
                                    {passwordData.newPassword && (
                                        <span className={`text-xs ${getStrengthColor()} px-3`}>
                                            Strength: {passwordStrength}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                        <span className="text-lg">✓</span> Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin">⟳</span> Updating...
                                            </span>
                                        ) : (
                                            '🔒 Update Password'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                        }}
                                        disabled={loading}
                                        className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transform hover:scale-[1.02] transition-all duration-200 font-bold disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="text-xs text-gray-600 px-3 w-full">
                                    Password must contain:
                                    <ul className="list-disc list-inside mt-1">
                                        <li>At least 8 characters</li>
                                        <li>One uppercase letter</li>
                                        <li>One lowercase letter</li>
                                        <li>One number</li>
                                        <li>One special character (!@#$%^&*)</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
                                <p className="text-gray-700 leading-relaxed">
                                    🛡️ Keep your account secure by updating your password regularly. Use a strong password with a mix of letters, numbers, and special characters.
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Stats Card (Only for regular users) */}
                    {/* {user?.role !== 'ngo' && (
                        <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-3xl shadow-2xl p-8 border-2 border-yellow-500 hover:shadow-yellow-400 hover:scale-[1.02] transition-all duration-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Activity</h3>
                            <div className="space-y-4">
                                <div className="bg-white bg-opacity-50 backdrop-blur rounded-2xl p-4">
                                    <p className="text-sm text-gray-700 font-bold">Reports Submitted</p>
                                    <p className="text-3xl font-bold text-gray-800">0</p>
                                </div>
                                <div className="bg-white bg-opacity-50 backdrop-blur rounded-2xl p-4">
                                    <p className="text-sm text-gray-700 font-bold">Cases Resolved</p>
                                    <p className="text-3xl font-bold text-gray-800">0</p>
                                </div>
                                <div className="bg-white bg-opacity-50 backdrop-blur rounded-2xl p-4">
                                    <p className="text-sm text-gray-700 font-bold">Member Since</p>
                                    <p className="text-xl font-bold text-gray-800">2024</p>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* NGO Contact Information Card */}
                    {user?.role === 'ngo' && user?.ngoDetails?.contactInfo && (
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 hover:scale-[1.02] transition-all duration-300">
                            <div className="mb-8">
                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Contact</span>
                                <h2 className="text-3xl font-bold text-gray-800 mt-2">Get In Touch</h2>
                            </div>

                            <div className="space-y-6">
                                {user.ngoDetails.contactInfo.phone && (
                                    <div>
                                        <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <span className="text-lg">📞</span> Phone
                                        </label>
                                        <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                                            {user.ngoDetails.contactInfo.phone}
                                        </p>
                                    </div>
                                )}

                                {user.ngoDetails.contactInfo.helpline && (
                                    <div>
                                        <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <span className="text-lg">🆘</span> 24/7 Helpline
                                        </label>
                                        <p className="text-lg text-gray-800 font-bold bg-red-50 px-4 py-3 rounded-xl border-2 border-red-200">
                                            {user.ngoDetails.contactInfo.helpline}
                                        </p>
                                    </div>
                                )}

                                {user.ngoDetails.contactInfo.email && (
                                    <div>
                                        <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <span className="text-lg">✉️</span> Email
                                        </label>
                                        <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                                            {user.ngoDetails.contactInfo.email}
                                        </p>
                                    </div>
                                )}

                                {user.ngoDetails.contactInfo.website && (
                                    <div>
                                        <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <span className="text-lg">🌐</span> Website
                                        </label>
                                        <a 
                                            href={`https://${user.ngoDetails.contactInfo.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg text-blue-600 hover:text-blue-800 font-medium bg-gray-50 px-4 py-3 rounded-xl block hover:bg-blue-50 transition-colors"
                                        >
                                            {user.ngoDetails.contactInfo.website}
                                        </a>
                                    </div>
                                )}

                                {user.ngoDetails.contactInfo.workingHours && (
                                    <div>
                                        <label className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <span className="text-lg">🕐</span> Working Hours
                                        </label>
                                        <p className="text-lg text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                                            {user.ngoDetails.contactInfo.workingHours}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200 mt-6">
                                    <p className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-lg">🔒</span>
                                        <span className="flex-1">
                                            <strong>Your identity is protected.</strong> All reports are anonymous and confidential.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NGO Services Card */}
                    {user?.role === 'ngo' && user?.ngoDetails?.services && user.ngoDetails.services.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-300 hover:shadow-yellow-300 hover:scale-[1.02] transition-all duration-300">
                            <div className="mb-8">
                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Services</span>
                                <h2 className="text-3xl font-bold text-gray-800 mt-2">What We Offer</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {user.ngoDetails.services.map((service, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200"
                                    >
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span className="text-gray-800 font-medium">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* NGO Statistics Card */}
                    {/* {user?.role === 'ngo' && user?.ngoDetails?.statistics && (
                        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl shadow-2xl p-8 border-2 border-teal-600 hover:shadow-teal-400 hover:scale-[1.02] transition-all duration-300">
                            <h3 className="text-2xl font-bold text-white mb-6">Our Impact</h3>
                            <div className="space-y-4">
                                <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl p-5">
                                    <p className="text-sm text-gray-700 font-bold mb-1">👥 Volunteers</p>
                                    <p className="text-4xl font-bold text-teal-700">{user.ngoDetails.statistics.volunteers}+</p>
                                </div>
                                <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl p-5">
                                    <p className="text-sm text-gray-700 font-bold mb-1">📊 Cases Handled</p>
                                    <p className="text-4xl font-bold text-yellow-600">{user.ngoDetails.statistics.casesHandled}+</p>
                                </div>
                                <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl p-5">
                                    <p className="text-sm text-gray-700 font-bold mb-1">✓ Success Rate</p>
                                    <p className="text-4xl font-bold text-green-600">{user.ngoDetails.statistics.successRate}%</p>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>

        </div>
    );
}

// Main component with mock provider
export default function ProfileWithProvider() {
    return (
        <MockAuthProvider>
            <Profile />
        </MockAuthProvider>
    );
}