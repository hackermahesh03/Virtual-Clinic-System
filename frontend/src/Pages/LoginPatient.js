import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";

const LoginPatient = () => {
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

      const { data } = await axios.post("/api/v1/patients/loginPatient", {
        email,
        password,
      });

      if (data?.success) {
        localStorage.removeItem("doctorID");
        localStorage.removeItem("doctorName");
        localStorage.setItem("patientID", data?.patient._id);
        localStorage.setItem("patientEmail", data?.patient.email);
        navigate("/alldoctors");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Patient Login</h1>
            <p className="text-indigo-100 mt-1">Access your medical portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  type="email"
                  placeholder="patient@example.com"
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
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="px-8 pb-6 text-center">
            <div className="text-xl text-gray-600 mb-4">
              Don't have an account?{" "}
              <Link
                to="/signuppatient"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Register here
              </Link>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xl text-gray-500">
                Or login as{" "}
                <Link
                  to="/logindoc"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Doctor
                </Link>{" "}
                or{" "}
                <Link
                  to="/loginadmin"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPatient;