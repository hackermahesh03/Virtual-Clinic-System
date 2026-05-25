import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GoDependabot } from "react-icons/go";
import { FcAbout } from "react-icons/fc";
import { CiMedicalClipboard } from "react-icons/ci";
import { FaClinicMedical } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { SiGooglemeet } from "react-icons/si";
import { TbReport } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";

const Header = () => {
  return (
    <>
      <div className="header h-20 bg-black text-white flex justify-between items-center px-10 ">
        <div className="font-bold text-4xl">SwatchArog</div>
        <div className="flex justify-evenly items-center gap-10 font-bold text-xl">
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/aboutpage"
          >
            <FcAbout />
            About
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/alldoctors"
          >
            <FaUserDoctor />
            Doctors
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/prescriptionPage"
          >
            <CiMedicalClipboard />
            Prescription
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/reportAdd"
          >
            <TbReport />
            Reports
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/pharmacy"
          >
            <FaClinicMedical />
            Pharmacies
          </Link>

          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/chatbot"
          >
            <GoDependabot />
            ChatBot
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/lung-disease"
          >
            <FaClinicMedical className="rotate-180" />
            Lung Analysis
          </Link>
          <Link
            className="hover:scale-105 hover:underline hover:underline-offset-4 cursor-pointer flex justify-center items-center gap-1"
            to="/meet"
          >
            <SiGooglemeet />
            Meet
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

export default Header;
