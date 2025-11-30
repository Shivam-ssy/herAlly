import { useState } from 'react';
import ApiService from '../services/apiServices';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setError('');
    setSuccess('');

    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.sendOTP({ phone });
      if (response.status === 200) {
        setSuccess('OTP sent successfully!');
        setStep(2);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.resetPassword({ phone, otp, newPassword });
      if (response.data.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF4F6] to-[#B9E5E8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#37B7C3] to-[#4ECDC4] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-sm opacity-90">
            {step === 1 ? 'Enter your phone number to receive OTP' : 'Enter OTP and new password'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-[#37B7C3] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="text-xs mt-2 text-gray-600">Phone</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-[#37B7C3]' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-[#37B7C3] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-xs mt-2 text-gray-600">Verify</span>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="px-8 pb-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#37B7C3] focus:outline-none transition"
                  maxLength="10"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#37B7C3] to-[#4ECDC4] text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}

          {/* Step 2: OTP & New Password */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#37B7C3] focus:outline-none transition"
                  maxLength="6"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#37B7C3] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#37B7C3] focus:outline-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#37B7C3] to-[#4ECDC4] text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a href="/login" className="text-[#37B7C3] hover:underline font-semibold">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;