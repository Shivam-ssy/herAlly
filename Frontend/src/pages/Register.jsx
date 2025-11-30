import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowContext from "../context/ShowContext";
import ApiService from "../services/apiServices";

function Register() {
  const { stylesChange, setStyleChange, setLoader } = useContext(ShowContext);
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    email: "",
    password: "",
    uniqueId: "",
    phone: "",
    state: "",
    district: "",
    passwordConfirm: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check password strength in real-time
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Handle name input with validation
  const handleNameChange = (e) => {
    const inputName = e.target.value;
    // Only allow letters and spaces
    if (!/[^a-zA-Z\s]/.test(inputName)) {
      setFormData((prev) => ({ ...prev, name: inputName }));
    }
  };

  // Password strength checker
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

  // Form validation
  const validateForm = () => {
    const { phone, email, password, details, passwordConfirm, name, uniqueId, state, district } = formData;

    // Common validations
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (!/^\d+$/.test(phone)) {
      toast.error("Phone number must contain only digits");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (!isStrongPassword(password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character (!@#$%^&*)"
      );
      return false;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return false;
    }

    // NGO-specific validations
    if (!stylesChange) {
      if (!name.trim()) {
        toast.error("NGO name is required");
        return false;
      }

      if (!email.trim()) {
        toast.error("Email is required");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return false;
      }

      if (!uniqueId.trim()) {
        toast.error("Unique Registration Number is required");
        return false;
      }

      if (!state.trim()) {
        toast.error("State is required");
        return false;
      }

      if (!district.trim()) {
        toast.error("District is required");
        return false;
      }

      if (!details.trim()) {
        toast.error("Please specify your major field");
        return false;
      }
    }

    return true;
  };

  // Handle user registration
  const handleUserRegister = async () => {
    try {
      const response = await ApiService.registerUser({
        phone: formData.phone,
        password: formData.password,
        role: "user",
      });

      if (response.data) {
        toast.success("Registration successful! Please login to continue.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      handleRegistrationError(error);
    }
  };

  // Handle NGO registration
  const handleNgoRegister = async () => {
    try {
      const response = await ApiService.registerUser({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "ngo",
        ngoDetails:{
          name: formData.name,
          uniqueId: formData.uniqueId,
          state: formData.state,
          district: formData.district,
          details: formData.details,
        }
      });
      console.log(response);
      
      if (response.data) {
        toast.success("Registration successful! Your application is in the queue for approval.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.log(error);
      
      handleRegistrationError(error);
    }
  };

  // Centralized error handling
  const handleRegistrationError = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        toast.error(message || "All fields are required");
        break;
      case 409:
        toast.error("User with this email or phone already exists");
        break;
      case 500:
        toast.error("Server error. Please try again later");
        break;
      default:
        toast.error(message || "Something went wrong. Please try again");
    }
  };

  // Main submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoader(true);

    try {
      if (stylesChange) {
        await handleUserRegister();
      } else {
        await handleNgoRegister();
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
      setLoader(false);
    }
  };

  // Handle registration type toggle
  const handleToggleRegistrationType = () => {
    setStyleChange(!stylesChange);
    // Clear form when switching
    setFormData({
      name: "",
      details: "",
      email: "",
      password: "",
      uniqueId: "",
      phone: "",
      state: "",
      district: "",
      passwordConfirm: "",
    });
    setPasswordStrength("");
  };

  // Password strength indicator color
  const getStrengthColor = () => {
    if (passwordStrength === "Strong") return "text-green-500";
    if (passwordStrength === "Medium") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <>
      <section
        data-scroll-section
        className="min-h-[calc(100vh-80px)] h-fit w-full flex flex-col justify-center items-center py-10"
      >
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

        <h3 className="text-4xl font-bold mb-5">New Registration</h3>

        <div
          className={`flex rounded-xl duration-200 ease-in-out overflow-hidden shadow-2xl ${
            !stylesChange ? "flex-row-reverse" : ""
          }`}
        >
          {/* Image Section */}
          <div
            className={`w-96 bg-cover bg-center ${
              stylesChange ? "bg-[url('/designerLogin.jpg')]" : "bg-[url('/login2.jpeg')]"
            }`}
          />

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex min-h-96 flex-col items-center px-10 gap-5 py-8"
          >
            <h3 className="text-3xl font-bold">Sign Up</h3>

            <div className="flex flex-col gap-4 w-full">
              {/* NGO Name */}
              {!stylesChange && (
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-user-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="NGO Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    disabled={isSubmitting}
                    autoComplete="organization"
                  />
                </div>
              )}

              {/* Email */}
              {!stylesChange && (
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-mail-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              )}

              {/* Phone */}
              <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                <i className="ri-phone-line text-2xl text-gray-600" />
                <input
                  className="outline-none h-full rounded-xl w-80 px-3"
                  placeholder="Phone (10 digits)"
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="tel"
                />
              </div>

              {/* Unique ID */}
              {!stylesChange && (
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-bank-card-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="Unique Registration Number"
                    type="text"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* State and District */}
              {!stylesChange && (
                <div className="flex w-full justify-between gap-3">
                  <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3 flex-1">
                    <input
                      className="outline-none h-full rounded-xl w-full px-3"
                      placeholder="State"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3 flex-1">
                    <input
                      className="outline-none h-full rounded-xl w-full px-3"
                      placeholder="District"
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Major Field */}
              {!stylesChange && (
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-briefcase-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="Major Field (e.g., Education, Health)"
                    type="text"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-lock-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
                {formData.password && (
                  <span className={`text-xs ${getStrengthColor()} px-3`}>
                    Strength: {passwordStrength}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
                  <i className="ri-lock-line text-2xl text-gray-600" />
                  <input
                    className="outline-none h-full rounded-xl w-80 px-3"
                    placeholder="Confirm Password"
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
                {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                  <span className="text-xs text-red-500 px-3">Passwords do not match</span>
                )}
              </div>
            </div>

            {/* Password Requirements */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 font-bold rounded-full transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <i className="ri-loader-4-line animate-spin" />
                  Signing Up...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Toggle Registration Type */}
            <div className="text-center">
              Sign Up as {stylesChange ? "NGO" : "Women"}?{" "}
              <button
                type="button"
                onClick={handleToggleRegistrationType}
                disabled={isSubmitting}
                className="text-blue-500 font-bold hover:underline disabled:opacity-50"
              >
                Click Here
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-bold hover:underline">
                Login Now
              </Link>
            </div>
          </form>
        </div>
      </section>
      <section data-scroll-section className="h-32" />
    </>
  );
}

export default Register;