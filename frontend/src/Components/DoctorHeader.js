import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosTime } from "react-icons/io";
import { FcAbout } from "react-icons/fc";
import { CiMedicalClipboard } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { TbReport } from "react-icons/tb";

const DoctorHeader = () => {
  return (
    <>
      <div className="header h-20 bg-black text-white flex justify-between items-center px-10">
        <div className="font-bold text-4xl">SwatchArog</div>
        <div className="flex justify-center items-center gap-16 font-bold text-2xl">
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/appointment"
          >
            <IoIosTime />
            Appointments
          </Link>

          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/doctorReport"
          >
            <TbReport />
            Reports
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/"
          >
            <IoMdLogOut />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};

export default DoctorHeader;
