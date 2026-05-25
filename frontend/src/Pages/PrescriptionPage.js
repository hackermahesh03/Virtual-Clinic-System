import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import {
  FaHandHoldingMedical,
  FaCalendarAlt,
  FaPills,
  FaFileAlt,
  FaNotesMedical,
} from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { MdMedicalServices } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

const PrescriptionPage = () => {
  const patientID = localStorage.getItem("patientID");
  const [prescription, setPrescription] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPatient = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/patients/getSinglePatient", {
        patientID: patientID,
      });
      if (data?.success) {
        setPrescription(data?.patient?.prescription || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatient();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-4">
              <FaHandHoldingMedical className="text-indigo-600 text-4xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Your Medical Prescriptions
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View and manage all your prescribed medications and doctor's notes
              in one place
            </p>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500">
                Loading your prescriptions...
              </div>
            </div>
          ) : prescription.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescription.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Prescription Header */}
                  <div className="bg-indigo-600 px-6 py-4 flex items-center">
                    <MdMedicalServices className="text-white text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-white">
                      Prescription #{index + 1}
                    </h2>
                  </div>

                  {/* Prescription Body */}
                  <div className="p-6">
                    {/* Doctor Info */}
                    <div className="flex items-center mb-6 p-3 bg-blue-50 rounded-lg">
                      <div className="bg-indigo-100 p-2 rounded-full mr-4">
                        <FaUserDoctor className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Prescribed by
                        </h3>
                        <p className="text-indigo-600 font-semibold">
                          {item.docname}
                        </p>
                      </div>
                    </div>

                    {/* Date Section */}
                    {item.date && (
                      <div className="flex items-center mb-4 text-gray-600">
                        <FaCalendarAlt className="mr-2 text-indigo-500" />
                        <span>
                          Date: {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Medicine Section */}
                    <div className="mb-6">
                      <div className="flex items-center mb-2 text-gray-700">
                        <GiMedicinePills className="mr-2 text-indigo-500" />
                        <h3 className="font-medium">Medications</h3>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {item.medicine}
                        </p>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <div className="flex items-center mb-2 text-gray-700">
                        <FaFileAlt className="mr-2 text-indigo-500" />
                        <h3 className="font-medium">Doctor's Notes</h3>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaNotesMedical className="text-blue-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Prescriptions Found
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have any prescriptions yet. Your doctor's
                prescriptions will appear here once they're issued.
              </p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                onClick={getPatient}
              >
                Refresh Prescriptions
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrescriptionPage;
