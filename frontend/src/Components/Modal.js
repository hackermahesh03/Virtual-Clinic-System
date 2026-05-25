import React, { useState } from "react";
import axios from "axios";
const Modal = ({ isVisible, onClose, patientID }) => {
  const doctorName = localStorage.getItem("doctorName");

  const [note, setNote] = useState("");
  const [medicine, setMedicine] = useState("");
  if (!isVisible) return null;

  const handleSave = async () => {
    console.log(doctorName);
    try {
      const { data } = await axios.post("/api/v1/patients/createPrescription", {
        patientID: patientID,
        docname: doctorName,
        note: note,
        medicine: medicine,
      });
      if (data?.success) {
        alert("Prescription sent");
        setNote("");
        setMedicine("");
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center p-4">
        <div className="w-[500px]">
          <div className="bg-white p-2 rounded-lg  flex flex-col justify-center items-center gap-6">
            <h1 className="font-bold text-xl">Prescription</h1>

            <div className="flex flex-col justify-center gap-10 w-[30vw]">
              <div className="flex justify-center flex-col gap-5 items-center mt-5">
                <textarea
                  className="bg-slate-200 outline-none rounded-xl shadow-xl p-4"
                  cols={50}
                  placeholder="NOTE"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <textarea
                  className="bg-slate-200 outline-none rounded-xl shadow-xl p-4"
                  cols={50}
                  placeholder="Medicines"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-center items-center gap-10">
                {" "}
                <button
                  className="bg-green-400 p-4 rounded-xl hover:bg-green-300  font-bold text-lg"
                  onClick={handleSave}
                >
                  Send
                </button>
                <button
                  className="bg-red-400 p-4 rounded-xl hover:bg-red-300  font-bold text-lg"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
