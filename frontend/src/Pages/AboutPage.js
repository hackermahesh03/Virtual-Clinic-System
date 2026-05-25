import React from "react";
import Header from "../Components/Header";

const AboutPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-300 flex justify-center items-center p-10">
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-xl shadow-2xl flex flex-row items-center gap-10 max-w-5xl">

          {/* Left Side - Content */}
          <div className="flex-1 text-gray-800">
            <h1 className="text-5xl font-extrabold drop-shadow-lg text-gray-900">SwatchArog</h1>
            <p className="text-lg mt-4 drop-shadow-md text-gray-700">
              Your one-stop healthcare solution, connecting patients with certified doctors 
              for seamless virtual consultations and medical support.
            </p>
            <ul className="mt-6 space-y-3 text-lg font-semibold text-gray-900">
              <li>✅ Online Doctor Appointment Booking</li>
              <li>✅ AI-Powered Chatbot Assistance</li>
              <li>✅ Digital Medical Reports & Prescriptions</li>
              <li>✅ Nearby Pharmacies & Maps</li>
              <li>✅ Secure & Reliable Video Consultations</li>
            </ul>
          </div>

          {/* Right Side - Image */}
          <div className="flex-1">
            <img 
              src="https://images.tristatetechnology.com/blog-images/uploads/2023/07/cost-to-develop-doctor-appointments-booking-app.jpg" 
              alt="Doctor Appointment App"
              className="h-80 w-full rounded-lg shadow-lg transform transition duration-500 hover:scale-105 border-4 border-white/50"
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default AboutPage;
