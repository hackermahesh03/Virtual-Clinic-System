// import React from "react";

// const SendReportDocPage = () => {

//     const [doctors, setDoctors] = useState([]);
//     const [totalDoc, settotalDocs] = useState();

//      const getDocs = async () => {
//        try {
//          const { data } = await axios.get("/api/v1/doctors/allDoctors");
//          if (data?.success) {
//            setDoctors(data?.doctors);
//            settotalDocs(data?.totalDoctors);
//          }
//        } catch (error) {
//          console.log(error);
//        }
//      };
//   return (
//     <>
//       <div className="bg-blue-200">
//         <div className="flex justify-center items-center p-4">
//           {showDoctorModal && (
//             <div className=" inset-0 h-screen bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center p-4">
//               <div className="w-[500px] p-4 overflow-auto">
//                 <div className="bg-white p-2 rounded-lg  flex flex-col justify-start items-center gap-6 overflow-auto">
//                   <h1 className="font-bold text-xl">Doctors</h1>

//                   <div className="flex flex-col justify-start gap-10  overflow-auto p-4">
//                     <div className="flex flex-col h-[600px] justify-start items-center gap-10 overflow-auto">
//                       {doctors.map((doctor) => {
//                         return (
//                           <div className="shadow-xl w-[300px] rounded-xl flex flex-col bg-white p-4 gap-4">
//                             <img
//                               className="w-full rounded-xl h-56"
//                               src={doctor.image}
//                             />
//                             <h1 className="font-bold text-lg">
//                               Name: {doctor.name}
//                             </h1>
//                             <h1 className="font-bold text-lg">
//                               Email: {doctor.email}
//                             </h1>
//                             <h1 className="font-bold text-lg">
//                               Speciality: {doctor.speciality}
//                             </h1>
//                             <button className="bg-violet-400 p-3 rounded-xl font-bold cursor-pointer hover:bg-violet-300 flex justify-center items-center text-xl gap-2">
//                               <MdOutlineConnectWithoutContact size={30} />
//                               Send
//                             </button>
//                           </div>
//                         );
//                       })}
//                     </div>
//                     <button
//                       className="bg-red-400 p-4 rounded-xl hover:bg-red-300 w-60 place-self-center  font-bold text-lg"
//                       onClick={() => {
//                         setShowDoctorModal(false);
//                         setLoading("");
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SendReportDocPage;
