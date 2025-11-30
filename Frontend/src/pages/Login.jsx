import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowContext from "../context/ShowContext";
import ApiService from "../services/apiServices";

function Login() {
  const { setUser, setLoader } = useContext(ShowContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    if (!identifier.trim()) {
      toast.error("Phone or Email is required");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  // Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setLoader(true);

    try {
      // Login API
      const response = await ApiService.loginUser({
        identifier,
        password,
      });

      toast.success("Login Successful!");

      // Fetch current user
      const currentUserResponse = await ApiService.getCurrentUser();
      const userData = currentUserResponse.data.data;

      setUser(userData);

      // Auto redirect based on role
      if (userData.role === "ngo") {
        navigate("/ngohome");
      } else if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/ngolist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
      setLoader(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <ToastContainer />

      <h3 className="text-4xl font-bold mb-5">Welcome Back!</h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-10 flex flex-col gap-6 w-[380px]"
      >
        <h3 className="text-3xl font-bold text-center">Sign In</h3>

        {/* Identifier (phone/email) */}
        <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
          <i className="ri-user-line text-2xl text-gray-600" />
          <input
            className="outline-none h-full rounded-xl w-full px-3"
            placeholder="Phone or Email"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Password */}
        <div className="flex border items-center border-gray-600 rounded-xl h-12 px-3">
          <i className="ri-lock-line text-2xl text-gray-600" />
          <input
            className="outline-none h-full rounded-xl w-full px-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <Link
          to="/forgot-password"
          className="font-bold text-blue-500 hover:underline text-center"
        >
          Forgot Password?
        </Link>

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
            <span className="flex items-center gap-2 justify-center">
              <i className="ri-loader-4-line animate-spin" />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Register */}
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-bold hover:underline"
          >
            Register Now
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
