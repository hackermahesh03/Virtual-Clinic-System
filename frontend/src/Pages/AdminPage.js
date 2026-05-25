import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import Cards from "../Components/Cards.js";

const AdminPage = () => {
  const [cardData, setCardData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setpatients] = useState([]);
  const [text, setText] = useState("Welcome To Admin page");

  const getDocs = async () => {
    try {
      const { data } = await axios.get("/api/v1/doctors/allDoctors");
      if (data?.success) {
        setDoctors(data?.doctors);
        console.log(data?.doctors);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPatients = async () => {
    try {
      const { data } = await axios.get("/api/v1/patients/getAllPatient");
      if (data?.success) {
        setpatients(data?.patients);
        console.log(data?.patients);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDocs();
    getPatients();
  }, []);

  return (
    <>
      <div className="header h-20 bg-black text-white flex justify-between items-center px-10">
        <div className="font-bold text-4xl">AI CareNet</div>
        <div className="flex justify-center items-center gap-16 font-bold text-2xl">
          <button
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            onClick={() => {
              setCardData(patients);
              setText("All Patients");
            }}
          >
            <FaUser />
            Patients
          </button>
          <button
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            onClick={() => {
              setCardData(doctors);
              setText("All Doctors");
            }}
          >
            <FaUserDoctor />
            Doctors
          </button>
        </div>
      </div>
      <div className="bg-blue-100 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center font-bold text-5xl mb-10 text-gray-800 tracking-tight">
            {text}
          </div>
          <div className="flex justify-center">
            <Cards cardData={cardData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
