import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import {
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaInfoCircle,
} from "react-icons/fa";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientMeet = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientID = localStorage.getItem("patientID");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/api/v1/appointments?patientID=${patientID}`);
        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientID) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [patientID]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <FaVideo className="mr-3 text-indigo-600" />
            My Video Consultations
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : appointments.filter(a => a.status !== 'Cancelled').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.filter(a => a.status !== 'Cancelled').map((appt) => (
                <div key={appt._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <FaUserMd className="text-indigo-600 text-xl" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        appt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Dr. {appt.doctorID?.name || "Your Doctor"}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-4">{appt.doctorID?.speciality}</p>
                    
                    <div className="space-y-2 mb-6 text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-indigo-400" />
                        <span>{appt.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-indigo-400" />
                        <span>{appt.time}</span>
                      </div>
                    </div>
                  </div>

                  {appt.status !== 'Completed' && (
                    <button
                      onClick={() => navigate(`/joinMeet/${appt._id}`)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center"
                    >
                      <FaVideo className="mr-2" />
                      Join Consultation Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
...
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
                  <FaVideo className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  No Upcoming Consultations
                </h2>
                <p className="text-gray-600 mb-6">
                  You don't have any scheduled video consultations at this time.
                  Please check back later or contact your healthcare provider.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                  Request Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientMeet;
