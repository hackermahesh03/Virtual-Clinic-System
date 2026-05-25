// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MdAddAPhoto } from "react-icons/md";
// import axios from "axios";

// const SignUpDoctor = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [speciality, setSpeciality] = useState("");
//   const [degree, setDegree] = useState("");
//   const [experience, setExperience] = useState("");
//   const [price, setPrice] = useState("");
//   const [contact, setContact] = useState("");
//   const [selectedImage, setSelectedImage] = useState();
//   const [loading, setLoading] = useState(false);
//   const handleSignUP = async () => {
//     try {
//       if (!name || !email || !password || !speciality) {
//         alert("Please fill all fields");
//         return;
//       }
//       const { data } = await axios.post("/api/v1/doctors/createDoctor", {
//         name: name,
//         email: email,
//         password: password,
//         speciality: speciality,
//         image: selectedImage,
//         price,
//       });
//       if (data?.success) {
//         alert("SignUp Sucess");
//         navigate("/logindoc");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleFileChange = async (e) => {
//     setLoading("Uploading....");
//     const file = e.target.files[0];

//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "pmcr8gua");
//       try {
//         const response = await axios.post(
//           "https://api.cloudinary.com/v1_1/dgplustqn/image/upload",
//           formData
//         );

//         setSelectedImage(response.data.url);
//         setLoading("");
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };
//   // useEffect(() => {
//   //   if (selectedImage) {
//   //     setLoading(false);
//   //   }
//   // }, [selectedImage]);
//   return (
//     <div className="bg-[url('https://www.ediiie.com/blog/assets/admin/uploads/ai-in-telemedicine.jpg')] min-h-screen min-w-screen bg-cover p-8">
//       <div className="flex justify-center items-center h-full">
//         <div className=" backdrop-blur-sm bg-white/40  rounded-xl bg-white flex  items-center flex-col p-8">
//           <h1 className="font-bold text-[50px] underline underline-offset-2">
//             SignUp as Doctor
//           </h1>
//           <div className="flex flex-col items-center gap-5 mt-10">
//             <div className="flex justify-between w-full gap-10">
//               {" "}
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black "
//                 type="text"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="Contact "
//                 value={contact}
//                 onChange={(e) => setContact(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-between w-full gap-10">
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="Speciality for ex (cardiologist)"
//                 value={speciality}
//                 onChange={(e) => setSpeciality(e.target.value)}
//               />
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="MBBS"
//                 value={degree}
//                 onChange={(e) => setDegree(e.target.value)}
//               />
//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="1"
//                 value={experience}
//                 onChange={(e) => setExperience(e.target.value)}
//               />

//               <input
//                 className="w-80 p-3 rounded-xl outline-none border-2 border-black"
//                 type="text"
//                 placeholder="Your consultation fees"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>

//             <label
//               className="bg-red-400 hover:scale-105 p-4 rounded-xl justify-center items-center flex gap-2 font-bold cursor-pointer mt-10"
//               for="file"
//             >
//               <MdAddAPhoto size={22} />
//               Profile Photo
//             </label>

//             <input
//               className="w-80 p-3 rounded-xl outline-none hidden"
//               type="file"
//               placeholder="Choose Image"
//               id="file"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//             <p>{loading}</p>
//             {selectedImage && (
//               <div className="font-bold">
//                 <p className="text-black text-sm">Selected Image:</p>
//                 <img
//                   src={selectedImage}
//                   alt="Selected"
//                   className="rounded-xl shadow-md h-40 w-48"
//                 />
//               </div>
//             )}

//             <button
//               className="mt-5 p-4 rounded-xl bg-violet-500 font-bold text-lg hover:bg-violet-400 cursor-pointer"
//               onClick={handleSignUP}
//             >
//               SignUp
//             </button>
//           </div>
//           <div className="flex flex-col items-center mt-10 gap-5 text-xl font-bold">
//             <h1>
//               Already have an account?{" "}
//               <Link to="/logindoc" className="underline underline-offset-1">
//                 Login
//               </Link>{" "}
//             </h1>
//             or
//             <h1>
//               SignUp as{" "}
//               <Link
//                 to="/signuppatient"
//                 className="underline underline-offset-1"
//               >
//                 Patient?
//               </Link>{" "}
//             </h1>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpDoctor;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaGraduationCap,
  FaBriefcase,
  FaMoneyBillWave,
  FaPhone,
  FaCamera,
  FaLock,
} from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import axios from "axios";

const SignUpDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    degree: "",
    experience: "",
    price: "",
    contact: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.speciality
      ) {
        setError("Please fill all required fields");
        return;
      }

      setLoading(true);
      setError("");

      const { data } = await axios.post("/api/v1/doctors/createDoctor", {
        ...formData,
        image: selectedImage,
      });

      if (data?.success) {
        navigate("/logindoc");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pmcr8gua");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgplustqn/image/upload",
        formData
      );
      setSelectedImage(response.data.url);
      setError("");
    } catch (error) {
      setError("Failed to upload image");
      console.error(error);
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 py-6 px-8 text-center">
          <div className="flex justify-center mb-3">
            <FaUserMd className="text-white text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Doctor Registration</h1>
          <p className="text-teal-100 mt-1">
            Join our medical professional network
          </p>
        </div>

        <form onSubmit={handleSignUp} className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="email"
                  name="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Speciality */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Speciality *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineHealthAndSafety className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  name="speciality"
                  placeholder="Cardiology"
                  value={formData.speciality}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Degree */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Degree
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  name="degree"
                  placeholder="MBBS, MD, etc."
                  value={formData.degree}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBriefcase className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  name="experience"
                  placeholder="Years of experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Contact
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="tel"
                  name="contact"
                  placeholder="+91 9876543210"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Consultation Fee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  name="price"
                  placeholder="Fee in ₹"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-teal-400 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition">
                  <FaCamera className="mr-2" />
                  {selectedImage ? "Change Photo" : "Upload Photo"}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {loading && (
                <span className="text-sm text-gray-500">{loading}</span>
              )}
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover border-2 border-teal-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center"
          >
            {loading ? (
              "Registering..."
            ) : (
              <>
                Complete Registration <FaUserMd className="ml-2" />
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/logindoc"
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpDoctor;
