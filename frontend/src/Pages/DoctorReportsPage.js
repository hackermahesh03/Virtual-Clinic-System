import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorHeader from "../Components/DoctorHeader";
import {
  FaFileMedicalAlt,
  FaUser,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaFlask,
  FaProcedures,
  FaNotesMedical,
  FaPills,
  FaTimes,
} from "react-icons/fa";
import { GiBlood } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";
import Modal from "../Components/Modal";

const DoctorReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [patientID, setPatientID] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const doctorID = localStorage.getItem("doctorID");
  const doctorName = localStorage.getItem("doctorName");

  const getDoctor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/doctors/singleDoc", {
        doctorID: doctorID,
      });
      if (data?.success) {
        setReports(data?.doctor?.reports || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  const PrescriptionModal = ({ isVisible, onClose, patientID }) => {
    const [note, setNote] = useState("");
    const [medicine, setMedicine] = useState("");
    const [sending, setSending] = useState(false);

    if (!isVisible) return null;

    const handleSave = async () => {
      try {
        setSending(true);
        const { data } = await axios.post(
          "/api/v1/patients/createPrescription",
          {
            patientID: patientID,
            docname: doctorName,
            note: note,
            medicine: medicine,
          }
        );
        if (data?.success) {
          setNote("");
          setMedicine("");
          onClose();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center border-b p-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaNotesMedical className="text-indigo-600" />
              New Prescription
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Clinical Notes
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Enter clinical notes and recommendations..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Medications
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="List medications with dosage and instructions..."
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={sending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {sending ? "Sending..." : "Send Prescription"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DoctorHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-4">
              <FaFileMedicalAlt className="text-indigo-600 text-4xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Patient Reports
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review patient health reports and create prescriptions
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500">
                Loading patient reports...
              </div>
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {report.image && (
                    <img
                      src={report.image}
                      alt="Report"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {report.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <GiBlood className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">BP: {report.BP}</span>
                      </div>
                      <div className="flex items-center">
                        <FaHeartbeat className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          HR: {report.heartrate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MdOutlineMonitorHeart className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          PR: {report.pulserate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaFlask className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          Sugar: {report.sugar}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaWeight className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          Weight: {report.weight}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaRulerVertical className="text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          Height: {report.height}
                        </span>
                      </div>
                    </div>
                    {report.surgeries && (
                      <div className="flex items-start mb-4">
                        <FaProcedures className="text-indigo-500 mr-2 mt-1" />
                        <span className="text-gray-700">
                          Surgeries: {report.surgeries}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPatientID(report.patientID);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-4"
                    >
                      <FaPills /> Create Prescription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaFileMedicalAlt className="text-blue-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Reports Available
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have any patient reports yet. Shared reports will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        patientID={patientID}
      />
    </>
  );
};

export default DoctorReportsPage;
