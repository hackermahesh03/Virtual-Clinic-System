import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaSignInAlt,
  FaUserInjured,
  FaUserMd,
} from "react-icons/fa";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);
      setError("");

      if (email === "admin@gmail.com" && password === "admin12345") {
        navigate("/admin-dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 py-8 px-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-full">
                <FaUserShield className="text-indigo-700 text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-indigo-200 mt-1">Secure system access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="email"
                  placeholder="admin@example.com"
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
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  <FaSignInAlt className="mr-2" /> Login
                </>
              )}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Or access as:</p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <FaUserInjured className="mr-1" /> Patient
                </Link>
                <Link
                  to="/logindoc"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <FaUserMd className="mr-1" /> Doctor
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
