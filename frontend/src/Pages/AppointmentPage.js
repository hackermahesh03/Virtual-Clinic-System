// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../Components/Header";
// import DoctorHeader from "../Components/DoctorHeader";

// const AppointmentsPage = () => {
//   const [appointments, setAppointments] = useState([]);
//   const patientID = localStorage.getItem("patientID");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const { data } = await axios.get(`/api/v1/appointments?patientID=${patientID}`);
//         if (data.success) {
//           setAppointments(data.appointments);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, [patientID]);

//   return (
//     <div>
//     {/* ✅ Add Header Here */}
//     <DoctorHeader/>
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Your Appointments</h1>
//       {appointments.length > 0 ? (
//         <div className="grid gap-4">
//           {appointments.map((appt) => (
//             <div key={appt._id} className="p-4 bg-white shadow-md rounded-md">
//               <h2 className="text-lg font-semibold">{appt.doctorID.name}</h2>
//               <p>Speciality: {appt.doctorID.speciality}</p>
//               <p>Date: {appt.date}</p>
//               <p>Slot: {appt.time}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-lg">No Appointments Found</p>
//       )}
//     </div>
//     </div>
//   );
// };

// export default AppointmentsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorHeader from "../Components/DoctorHeader";
import { useNavigate } from "react-router-dom";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorID = localStorage.getItem("doctorID");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/appointments?doctorID=${doctorID}`
        );
        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [doctorID]);

  // Function to cancel an appointment
  const handleCancelAppointment = async (appointmentID) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/appointments/${appointmentID}`
      );
      if (data.success) {
        setAppointments(
          appointments.filter((appt) => appt._id !== appointmentID)
        );
        alert("Appointment canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment.");
    }
  };

  // Function to mark an appointment as completed
  const handleMarkCompleted = async (appointmentID) => {
    try {
      const { data } = await axios.put(
        `/api/v1/appointments/${appointmentID}`,
        { status: "Completed" }
      );
      if (data.success) {
        setAppointments(
          appointments.map((appt) =>
            appt._id === appointmentID ? { ...appt, status: "Completed" } : appt
          )
        );
        alert("Appointment marked as completed!");
      }
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      alert("Failed to update appointment.");
    }
  };

  return (
    <div>
      <DoctorHeader />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Your Patient Appointments
        </h1>
        {appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="p-4 bg-white shadow-md rounded-md">
                <h2 className="text-lg font-semibold">
                  Patient: {appt.patientID.name}
                </h2>
                <p>Date: {appt.date}</p>
                <p>Slot: {appt.time}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      appt.status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {appt.status}
                  </span>
                </p>
                <div className="mt-3 flex gap-2">
                  {appt.status !== "Completed" && appt.status !== "Cancelled" && (
                    <button
                      onClick={() => navigate(`/joinMeet/${appt._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm"
                    >
                      Join Meeting
                    </button>
                  )}
                  <button
                    onClick={() => handleMarkCompleted(appt._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={appt.status === "Completed"}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(appt._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No Appointments Found</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
