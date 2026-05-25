import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import { CgProfile } from "react-icons/cg";

const PatientProfilePage = () => {
  const patientID = localStorage.getItem("patientID");
  const [name, setName] = useState("");
  const [adhaarno, setAdhaarno] = useState("");

  const getPatient = async () => {
    try {
      const { data } = await axios.post("/api/v1/patients/getSinglePatient", {
        patientID: patientID,
      });
      if (data?.success) {
        setName(data?.patient?.name);
        setAdhaarno(data?.patient?.adhaarno);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPatient();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-blue-200 min-h-screen">
        <div className="p-4 content flex justify-center items-center h-[70vh]">
          <div className="bg-white p-4 rounded-xl flex justify-center items-center flex-col gap-5 font-bold text-xl shadow-xl">
            <CgProfile size={80} />
            <h1>Name: {name}</h1>
            <h1>Adhaar No: {adhaarno}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfilePage;
