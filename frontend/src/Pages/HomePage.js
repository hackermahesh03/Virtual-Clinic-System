import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaUserAstronaut, FaUserShield } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Patient Portal",
      description: "Book appointments, view prescriptions, and consult with doctors.",
      icon: <FaUserAstronaut size={50} className="text-blue-500 mb-4" />,
      path: "/", // Patient Login is currently at root, but we'll change it
      action: () => navigate("/loginpatient")
    },
    {
      title: "Doctor Portal",
      description: "Manage your appointments, patients, and digital prescriptions.",
      icon: <FaUserMd size={50} className="text-indigo-500 mb-4" />,
      action: () => navigate("/logindoc")
    },
    {
      title: "Admin Portal",
      description: "Oversee system operations, manage healthcare providers and users.",
      icon: <FaUserShield size={50} className="text-purple-500 mb-4" />,
      action: () => navigate("/loginadmin")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
          AI Telemedicine Portal
        </h1>
        <p className="text-xl text-indigo-700 max-w-2xl">
          Welcome to our advanced healthcare platform. Please select your portal to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div 
            key={index}
            onClick={card.action}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-indigo-50"
          >
            {card.icon}
            <h2 className="text-2xl font-bold text-indigo-800 mb-3">{card.title}</h2>
            <p className="text-gray-600 mb-6">{card.description}</p>
            <button className="mt-auto px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
              Access Portal
            </button>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-indigo-400 text-sm">
        &copy; 2026 AI Telemedicine System. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
