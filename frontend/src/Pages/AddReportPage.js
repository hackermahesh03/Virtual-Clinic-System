import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import {
  FaFileMedicalAlt,
  FaUserMd,
  FaPlusCircle,
  FaFileDownload,
  FaPaperPlane,
  FaTimes,
  FaUpload,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaFlask,
  FaProcedures,
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
} from "react-icons/fa";
import { GiBlood } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";

const AddReportPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [BP, setBP] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sugar, setSugar] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [heartrate, setHeartrate] = useState("");
  const [pulserate, setPulserate] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState("");
  const patientID = localStorage.getItem("patientID");
  const [reports, setReports] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pmcr8gua");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgplustqn/image/upload",
        formData
      );
      setImage(response.data.url);
      setLoading("Uploaded");
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading("Upload failed");
    }
  };

  const getPatient = async () => {
    try {
      const { data } = await axios.post("/api/v1/patients/getSinglePatient", {
        patientID: patientID,
      });
      if (data?.success) {
        setPatientName(data?.patient.name);
        setReports(data?.patient?.reports || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPatient();
  }, []);

  const handleSaveReport = async () => {
    try {
      const { data } = await axios.post("/api/v1/patients/createReport", {
        patientID: patientID,
        BP,
        weight,
        height,
        heartrate,
        pulserate,
        sugar,
        surgeries,
        image,
      });

      if (data?.success) {
        getPatient();
        setModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDocs = async () => {
    try {
      const { data } = await axios.get("/api/v1/doctors/allDoctors");
      if (data?.success) {
        setDoctors(data?.doctors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (id) => {
    try {
      const { data } = await axios.post("/api/v1/doctors/createReport", {
        name: patientName,
        doctorID: id,
        BP,
        weight,
        height,
        heartrate,
        pulserate,
        sugar,
        surgeries,
        image,
        patientID,
      });
      if (data.success) {
        alert("Report sent successfully");
        setShowDoctorModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateReport = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 1200;

    context.fillStyle = "#f5f5f5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "30px Arial bold";
    context.fillStyle = "#333";
    context.fillText("Patient Health Report", canvas.width / 2 - 150, 50);

    context.font = "20px Arial bold";
    context.fillText("Patient Information", 30, 120);
    context.font = "16px Arial";
    context.fillText("Name:", 50, 150);
    context.fillText(`${patientName}`, 120, 150);
    context.fillText("Age:", 50, 180);
    context.fillText(`${age}`, 120, 180);
    context.fillText("Gender:", 50, 210);
    context.fillText(`${gender}`, 120, 210);

    context.strokeRect(10, 250, canvas.width - 20, 300);
    context.font = "20px Arial bold";
    context.fillText("Vitals", 30, 300);
    context.font = "16px Arial";
    context.fillText("Blood Pressure:", 50, 330);
    context.fillText(`${BP}`, 180, 330);
    context.fillText("Pulse Rate:", 50, 360);
    context.fillText(`${pulserate}`, 180, 360);
    context.fillText("Surgeries:", 50, 390);
    context.fillText(`${surgeries}`, 180, 390);
    context.fillText("Sugar level:", 50, 420);
    context.fillText(`${sugar}`, 180, 420);
    context.fillText("Weight:", 50, 450);
    context.fillText(`${weight}`, 180, 450);
    context.fillText("Height:", 50, 480);
    context.fillText(`${height}`, 180, 480);

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${patientName}_health_report.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    resetForm();
    setReportModal(false);
  };

  const resetForm = () => {
    setBP("");
    setWeight("");
    setHeight("");
    setSugar("");
    setSurgeries("");
    setHeartrate("");
    setPulserate("");
    setImage("");
    setLoading("");
    setAge("");
    setGender("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-4">
              <FaFileMedicalAlt className="text-indigo-600 text-4xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Health Reports
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your medical reports and share with doctors
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md"
            >
              <FaPlusCircle size={20} />
              Add New Report
            </button>
            <button
              onClick={() => setReportModal(true)}
              className="flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md"
            >
              <FaFileDownload size={20} />
              Generate Report
            </button>
          </div>

          {reports.length > 0 ? (
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
                      <div className="flex items-start">
                        <FaProcedures className="text-indigo-500 mr-2 mt-1" />
                        <span className="text-gray-700">
                          Surgeries: {report.surgeries}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setBP(report.BP);
                        setWeight(report.weight);
                        setHeight(report.height);
                        setSugar(report.sugar);
                        setSurgeries(report.surgeries);
                        setHeartrate(report.heartrate);
                        setPulserate(report.pulserate);
                        setImage(report.image);
                        setShowDoctorModal(true);
                        getDocs();
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                      <FaPaperPlane /> Share with Doctor
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
                No Reports Found
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't added any health reports yet.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Add Your First Report
              </button>
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="flex justify-between items-center border-b p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Add New Health Report
                </h3>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Blood Pressure
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GiBlood className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="120/80"
                          value={BP}
                          onChange={(e) => setBP(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Heart Rate
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaHeartbeat className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="72 bpm"
                          value={heartrate}
                          onChange={(e) => setHeartrate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Pulse Rate
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdOutlineMonitorHeart className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="72 bpm"
                          value={pulserate}
                          onChange={(e) => setPulserate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Sugar Level
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaFlask className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="90 mg/dL"
                          value={sugar}
                          onChange={(e) => setSugar(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Weight
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaWeight className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="70 kg"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Height
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRulerVertical className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="175 cm"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Surgeries
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaProcedures className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Previous surgeries"
                          value={surgeries}
                          onChange={(e) => setSurgeries(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Upload Report
                      </label>
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center px-4 py-12 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                          <FaUpload className="mr-2" />
                          {loading || "Click to upload report"}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFile}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReport}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="flex justify-between items-center border-b p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Generate Health Report
                </h3>
                <button
                  onClick={() => {
                    setReportModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Age
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="30"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Gender
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaVenusMars className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Male/Female/Other"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Blood Pressure
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GiBlood className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="120/80"
                          value={BP}
                          onChange={(e) => setBP(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Heart Rate
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaHeartbeat className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="72 bpm"
                          value={heartrate}
                          onChange={(e) => setHeartrate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Pulse Rate
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdOutlineMonitorHeart className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="72 bpm"
                          value={pulserate}
                          onChange={(e) => setPulserate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Sugar Level
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaFlask className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="90 mg/dL"
                          value={sugar}
                          onChange={(e) => setSugar(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Weight
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaWeight className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="70 kg"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Height
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRulerVertical className="text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="175 cm"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setReportModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDoctorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-gray-800">
                  Select Doctor to Share With
                </h3>
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {doctor.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {doctor.speciality}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {doctor.email}
                          </p>
                          <button
                            onClick={() => handleSend(doctor._id)}
                            className="mt-3 flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg"
                          >
                            <FaPaperPlane /> Send Report
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddReportPage;
