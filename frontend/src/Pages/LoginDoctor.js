import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserMd,
  FaLock,
  FaArrowRight,
  FaUserInjured,
  FaUserShield,
} from "react-icons/fa";

const LoginDoctor = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);
      setError("");

      const { data } = await axios.post("/api/v1/doctors/loginDoctor", {
        email,
        password,
      });

      if (data?.success) {
        localStorage.removeItem("patientID");
        localStorage.removeItem("patientEmail");
        localStorage.setItem("doctorID", data?.doctor._id);
        localStorage.setItem("doctorName", data?.doctor.name);
        navigate("/appointment");
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      const status = error.response?.data?.accountStatus;
      if (status === 'pending') {
        setError("⏳ " + msg);
      } else if (status === 'blocked') {
        setError("🚫 " + msg);
      } else {
        setError(msg || "Login failed. Please check your credentials.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
      <div className="w-[500px] mx-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-teal-600 py-6 px-8 text-center">
            <div className="flex justify-center mb-2">
              <FaUserMd className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Doctor Login</h1>
            <p className="text-teal-100 mt-1">Access your medical dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Professional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Access Dashboard <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="px-8 pb-6 text-center">
            <div className="text-xl text-gray-600 mb-3">
              New to our platform?{" "}
              <Link
                to="/signupdoc"
                className="text-teal-600 hover:text-teal-800 font-medium"
              >
                Register as Doctor
              </Link>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xl text-gray-500">
                Alternatively, login as{" "}
                <Link
                  to="/"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  <FaUserInjured className="inline mr-1" /> Patient
                </Link>{" "}
                or{" "}
                <Link
                  to="/loginadmin"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  <FaUserShield className="inline mr-1" /> Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDoctor;