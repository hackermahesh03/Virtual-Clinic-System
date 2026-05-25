// import React, { useEffect, useState } from "react";
// import DoctorHeader from "../Components/DoctorHeader";
// import axios from "axios";

// import { IoPerson } from "react-icons/io5";
// import { CiMedicalClipboard } from "react-icons/ci";
// import Modal from "../Components/Modal";

// const DocPrescriptionPage = () => {
//   const doctorID = localStorage.getItem("doctorID");

//   const [appointment, setAppointment] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const getDoctor = async () => {
//     try {
//       const { data } = await axios.post("/api/v1/doctors/singleDoc", {
//         doctorID: doctorID,
//       });
//       if (data?.success) {
//         console.log(data?.doctor?.appointments);
//         setAppointment(data?.doctor?.appointments);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getDoctor();
//   }, []);
//   return (
//     <>
//       <DoctorHeader />
//       <div className="min-h-screen bg-blue-200 p-4 flex flex-col">
//         <h1 className="place-self-center mt-10 text-6xl font-bold">
//           Prescriptions
//         </h1>
//         <h1 className="place-self-center mt-10 text-xl font-bold">
//           (Total Appointments: {appointment.length})
//         </h1>
//         <div className="content p-4 flex flex-wrap  gap-20 justify-evenly items-center mt-20">
//           {appointment.map((item) => {
//             return (
//               <div className="bg-white rounded-xl p-8  font-bold text-lg flex flex-col gap-5">
//                 <IoPerson className="place-self-center" size={80} />
//                 <p>Patient Name: {item.name}</p>
//                 <p>Patient Adhaar No: {item.adhaarno}</p>

//                 <div className="flex justify-center items-center gap-5">
//                   <button
//                     className="p-4 rounded-xl bg-green-500 cursor-pointer hover:bg-green-400 flex justify-center items-center w-full"
//                     onClick={() => {
//                       setShowModal(true);
//                     }}
//                   >
//                     <CiMedicalClipboard size={30} />
//                     Send Prescriptions
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
//     </>
//   );
// };

// export default DocPrescriptionPage;









import React, { useEffect, useState } from "react";
import DoctorHeader from "../Components/DoctorHeader";
import axios from "axios";

import { IoPerson } from "react-icons/io5";
import { CiMedicalClipboard } from "react-icons/ci";
import Modal from "../Components/Modal";

const DocPrescriptionPage = () => {
  const doctorID = localStorage.getItem("doctorID"); // Fetch doctor ID from local storage

  const [appointments, setAppointments] = useState([]); // State to store doctor’s appointments
  const [showModal, setShowModal] = useState(false);

  // Fetch doctor details including appointments
  const getDoctor = async () => {
    if (!doctorID) {
      console.error("Doctor ID is missing");
      return;
    }

    try {
      const { data } = await axios.post("/api/v1/doctors/singleDoc", {
        doctorID: doctorID,
      });

      if (data?.success && data?.doctor?.appointments?.length > 0) {
        console.log("Appointments fetched:", data.doctor.appointments);
        setAppointments(data.doctor.appointments);
      } else {
        console.log("No appointments found");
        setAppointments([]); // Ensure state is updated
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setAppointments([]); // Prevent undefined state issues
    }
  };

  useEffect(() => {
    getDoctor();
  }, [doctorID]); // Ensure API runs only when doctorID is available

  return (
    <>
      <DoctorHeader />
      <div className="min-h-screen bg-blue-200 p-4 flex flex-col">
        <h1 className="place-self-center mt-10 text-6xl font-bold">
          Prescriptions
        </h1>
        <h1 className="place-self-center mt-10 text-xl font-bold">
          (Total Appointments: {appointments.length})
        </h1>

        <div className="content p-4 flex flex-wrap gap-20 justify-evenly items-center mt-20">
          {appointments.length > 0 ? (
            appointments.map((item) => (
              <div
                key={item._id} // Add a unique key to prevent React warnings
                className="bg-white rounded-xl p-8 font-bold text-lg flex flex-col gap-5 shadow-lg"
              >
                <IoPerson className="place-self-center" size={80} />
                <p>Patient Name: {item.name}</p>
                <p>Patient Aadhaar No: {item.adhaarno}</p>

                <div className="flex justify-center items-center gap-5">
                  <button
                    className="p-4 rounded-xl bg-green-500 cursor-pointer hover:bg-green-400 flex justify-center items-center w-full"
                    onClick={() => setShowModal(true)}
                  >
                    <CiMedicalClipboard size={30} />
                    Send Prescriptions
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-2xl font-semibold text-gray-600">
              No appointments available
            </p>
          )}
        </div>
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default DocPrescriptionPage;
