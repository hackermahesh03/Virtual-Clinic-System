// import React, { useEffect, useState } from "react";
// import Header from "../Components/Header";
// import axios from "axios";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { MdOutlineConnectWithoutContact } from "react-icons/md";
// const AllDoctorsPage = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [totalDoc, setTotalDocs] = useState();
//   const [filteredDoctors, setFilteredDoctors] = useState([]); // New state for filtered doctors
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term
//   const patientID = localStorage.getItem("patientID");
//   const [request, setRequest] = useState(false);
//   const email = localStorage.getItem("patientEmail");

//   const getDocs = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/doctors/allDoctors");
//       if (data?.success) {
//         setDoctors(data?.doctors);
//         setFilteredDoctors(data?.doctors); // Initialize filtered doctors with all doctors
//         setTotalDocs(data?.totalDoctors);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleConnect = async (doctorID, price) => {
//     setRequest(true);
//     const options = {
//       key: "rzp_test_ocDqI1oN10flt3", // Replace with your Razorpay Key ID
//       amount: price * 100, // Amount in paise (50000 paise = ₹500)
//       currency: "INR",
//       name: "Appointment Fees",
//       description: "Payment for your appointment",
//       image:
//         "https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Add your logo URL
//       handler: function (response) {
//         alert(
//           "Payment Successful! Payment ID: " + response.razorpay_payment_id
//         );
//         console.log(response);
//       },

//       theme: {
//         color: "#0d6efd", // Change to match your theme
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//     try {
//       const { data } = await axios.post(
//         "/api/v1/doctors/getDocForAppointment",
//         {
//           doctorID: doctorID,
//           patientID: patientID,
//         }
//       );
//       if (data?.success) {
//         setRequest(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Function to handle search
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = doctors.filter((doctor) =>
//       doctor.speciality.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredDoctors(filtered);
//   };

//   useEffect(() => {
//     getDocs();
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-blue-200 p-4">
//         <h1 className="flex justify-center items-center mt-10 font-bold text-5xl">
//           All Doctors
//         </h1>
//         <h1 className="flex justify-center items-center mt-10 font-bold text-xl">
//           (Total Doctors: {totalDoc})
//         </h1>
//         {/* Search input */}
//         <div className="flex justify-center mt-6">
//           <input
//             type="text"
//             placeholder="Search by Speciality"
//             className="px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:border-blue-500"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//         {request ? (
//           <div className="w-full flex justify-center items-center animate-spin mt-20">
//             <AiOutlineLoading3Quarters size={80} />
//           </div>
//         ) : (
//           <div className="flex mt-14 justify-start flex-wrap gap-10 p-4">
//             {filteredDoctors.map((doctor) => {
//               return (
//                 <div
//                   key={doctor._id}
//                   className="shadow-xl rounded-xl flex flex-col bg-white p-4 gap-4"
//                 >
//                   <img
//                     className="w-72 rounded-xl h-56 place-self-center"
//                     src={doctor.image}
//                     alt={doctor.name}
//                   />
//                   <h1 className="font-bold text-lg">Name: {doctor.name}</h1>
//                   <h1 className="font-bold text-lg">Email: {doctor.email}</h1>
//                   <h1 className="font-bold text-lg">
//                     Speciality: {doctor.speciality}
//                   </h1>
//                   <button
//                     className="bg-violet-400 p-3 rounded-xl font-bold cursor-pointer hover:bg-violet-300 flex justify-center items-center text-xl gap-2"
//                     onClick={() => handleConnect(doctor._id, doctor?.price)}
//                   >
//                     <MdOutlineConnectWithoutContact size={30} />
//                     Request
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AllDoctorsPage;















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import Header from "../Components/Header";
// import axios from "axios";
// import { MdOutlineConnectWithoutContact } from "react-icons/md";

// const AllDoctorsPage = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [totalDoc, setTotalDocs] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate(); // Use navigate for routing

//   // Fetch all doctors
//   const getDocs = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/doctors/allDoctors");
//       if (data?.success) {
//         setDoctors(data?.doctors);
//         setTotalDocs(data?.totalDoctors);
//       }
//     } catch (error) {
//       console.log("Error fetching doctors:", error);
//     }
//   };

//   useEffect(() => {
//     getDocs();
//   }, []);

//   // Handle search filter
//   const filteredDoctors = doctors.filter((doctor) =>
//     doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Navigate to Book Appointment Page
//   const handleAppointment = (doctorID) => {
//     navigate(`/book-appointment/${doctorID}`); // Updated route
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-blue-200 p-4">
//         <h1 className="flex justify-center items-center mt-10 font-bold text-5xl">
//           All Doctors
//         </h1>
//         <h1 className="flex justify-center items-center mt-10 font-bold text-xl">
//           (Total Doctors: {totalDoc})
//         </h1>
//         <div className="flex justify-center mt-6">
//           <input
//             type="text"
//             placeholder="Search by Speciality"
//             className="px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:border-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex mt-14 justify-start flex-wrap gap-10 p-4">
//           {filteredDoctors.length > 0 ? (
//             filteredDoctors.map((doctor) => (
//               <div
//                 key={doctor._id}
//                 className="shadow-xl rounded-xl flex flex-col bg-white p-4 gap-4"
//               >
//                 <img
//                   className="w-72 rounded-xl h-56 place-self-center"
//                   src={doctor.image}
//                   alt={doctor.name}
//                 />
//                 <h1 className="font-bold text-lg">Name: {doctor.name}</h1>
//                 <h1 className="font-bold text-lg">Email: {doctor.email}</h1>
//                 <h1 className="font-bold text-lg">
//                   Speciality: {doctor.speciality}
//                 </h1>
//                 <button
//                   className="bg-violet-400 p-3 rounded-xl font-bold cursor-pointer hover:bg-violet-300 flex justify-center items-center text-xl gap-2"
//                   onClick={() => handleAppointment(doctor._id)}
//                 >
//                   <MdOutlineConnectWithoutContact size={30} />
//                   Book Appointment
//                 </button>
//               </div>
//             ))
//           ) : (
//             <h2 className="text-center text-lg font-semibold">
//               No doctors found with this speciality.
//             </h2>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AllDoctorsPage;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Header from "../Components/Header";
import axios from "axios";

const AllDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [totalDoc, setTotalDocs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch all doctors
  const getDocs = async () => {
    try {
      const { data } = await axios.get("/api/v1/doctors/allDoctors");
      if (data?.success) {
        setDoctors(data?.doctors);
        setTotalDocs(data?.totalDoctors);
      }
    } catch (error) {
      console.log("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getDocs();
  }, []);

  // Handle search filter
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to Book Appointment Page
  const handleAppointment = (doctorID) => {
    navigate(`/book-appointment/${doctorID}`);
  };

  return (
    <>
      <Header />
      <div
        className=" min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-300 flex justify-center items-center p-10"
        
      >
        <Container>
          <h1 className="text-center font-weight-bold display-4 mt-4 text-dark" style={{ fontFamily: "Poppins, sans-serif" }}>
            All Doctors
          </h1>
          <h5 className="text-center text-muted">(Total Doctors: {totalDoc})</h5>

          {/* Search Bar with Icon */}
          <div className="d-flex justify-content-center my-4">
            <InputGroup className="w-50 shadow-sm">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Speciality"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Doctors Grid */}
          <Row className="g-4 mt-3">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Col md={4} key={doctor._id}>
                  <Card className="shadow-lg border-0 rounded-lg overflow-hidden bg-white transition-transform transform hover:scale-105">
                    <Card.Img
                      variant="top"
                      src={doctor.image}
                      alt={doctor.name}
                      className="rounded-top w-100"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-bold text-center text-primary" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {doctor.name}
                      </Card.Title>
                      <Card.Text className="text-muted text-center">{doctor.email}</Card.Text>
                      <Card.Text className="text-center">
                        <strong>Speciality:</strong> {doctor.speciality}
                      </Card.Text>
                      <div className="d-flex justify-content-center">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                          onClick={() => handleAppointment(doctor._id)}
                        >
                          <MdOutlineConnectWithoutContact size={24} />
                          Book Appointment
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <h4 className="text-center text-secondary">No doctors found with this speciality.</h4>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AllDoctorsPage;


