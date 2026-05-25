import React, { useState } from "react";
import DoctorHeader from "../Components/DoctorHeader";
import axios from "axios";

const ProfileDocPage = () => {
  const doctorID = localStorage.getItem("doctorID");
  const [doctor, setDoctor] = useState("");

  const getDoctor = async () => {
    try {
      const { data } = await axios.post("/api/v1/doctors/singleDoc", {
        doctorID: doctorID,
      });
      if (data?.success) {
        setDoctor(data?.doctor);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <DoctorHeader />
    </>
  );
};

export default ProfileDocPage;
