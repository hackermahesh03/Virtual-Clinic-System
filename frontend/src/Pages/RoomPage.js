import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorHeader from "../Components/DoctorHeader";
const RoomPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const handleJoin = async () => {
    localStorage.setItem("link", `http://localhost:3000/joinmeet/${value}`);

    navigate(`/joinMeet/${value}`);
  };
  return (
    <>
      <DoctorHeader />
      <div className="bg-blue-200 min-h-screen p-4">
        <div className="content p-4 mt-10">
          <div className="flex justify-center items-center gap-4">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="p-3 outline-none rounded-xl w-[400px]"
              placeholder="Enter your name"
            />
            <button
              className="bg-violet-500 cursor-pointer hover:bg-violet-400 p-4 font-bold rounded-xl"
              onClick={handleJoin}
            >
              Join & Send Link to patient
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomPage;
