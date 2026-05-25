import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserMd,
} from "react-icons/fa";
import axios from "axios";

const SignUpPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill all required fields");
        return;
      }

      setLoading(true);
      setError("");

      const { data } = await axios.post(
        "/api/v1/patients/createPatient",
        formData
      );

      if (data?.success) {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Patient Registration
            </h1>
            <p className="text-indigo-100 mt-1">Create your health account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="email"
                  name="email"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Register <FaArrowRight className="ml-2" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Login here
              </Link>
            </div>

            {/* Doctor SignUp Link */}
            <div className="border-t border-gray-200 mt-6 pt-4 text-center">
              <p className="text-xs text-gray-500">
                Are you a medical professional?{" "}
                <Link
                  to="/signupdoc"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <FaUserMd className="inline mr-1" /> Register as Doctor
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPatient;
