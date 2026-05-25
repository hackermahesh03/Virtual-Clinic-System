import React, { useState } from "react";
import axios from "axios";
import Header from "../Components/Header";
import { AiOutlineLoading3Quarters, AiOutlineCloudUpload } from "react-icons/ai";
import { FaUserMd, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const LungDiseasePage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("http://localhost:2000/api/v1/ai/lung-classify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setResult(data);
      }
    } catch (error) {
      console.error("Error classifying image:", error);
      alert("Error analyzing X-ray. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Chest X-Ray Analysis</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your chest X-ray for instant AI-powered detection of COVID-19, Pneumonia, and other lung conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 text-center ${
                preview ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
              {preview ? (
                <img src={preview} alt="X-ray Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <AiOutlineCloudUpload size={32} />
                  </div>
                  <p className="text-slate-700 font-medium">Click or drag X-ray image here</p>
                  <p className="text-slate-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
                !file || loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200"
              }`}
            >
              {loading ? (
                <><AiOutlineLoading3Quarters className="animate-spin mr-2" /> Analyzing Scan...</>
              ) : "Predict Condition"}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {result ? (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Diagnosis Result</h2>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    result.prediction === "Normal" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {result.confidence} Match
                  </span>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                  <p className="text-slate-500 uppercase tracking-wider text-xs font-bold mb-1">Detected Condition</p>
                  <p className={`text-3xl font-black ${
                    result.prediction === "Normal" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {result.prediction}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-slate-800 font-bold mb-4 flex items-center">
                    <FaUserMd className="mr-2 text-blue-600" /> Suggested Specialists
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-left">
                    {result.suggestedDoctors.length > 0 ? (
                      result.suggestedDoctors.map((doc) => (
                        <Link 
                          to={`/book-appointment/${doc._id}`}
                          key={doc._id}
                          className="group flex items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all duration-300"
                        >
                          <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 group-hover:text-blue-600">{doc.name}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase">{doc.speciality}</p>
                          </div>
                          <FaChevronRight className="text-slate-300 group-hover:text-blue-600" />
                        </Link>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No specialists found in your area.</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400 italic">
                  *This is an AI-generated analysis and should not be used as a final medical diagnosis. Please consult with the recommended specialists.
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 h-full min-h-[400px] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <FaUserMd size={64} className="mb-6 opacity-20" />
                <p className="text-lg font-medium">Analysis results will appear here after upload</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungDiseasePage;
