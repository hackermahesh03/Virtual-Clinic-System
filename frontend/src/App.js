import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPatient from "./Pages/LoginPatient";
import LoginDoctor from "./Pages/LoginDoctor";
import LoginAdmin from "./Pages/LoginAdmin";
import SignUpPatient from "./Pages/SignUpPatient";
import SignUpDoctor from "./Pages/SignUpDoctor";
import AdminPage from "./Pages/AdminPage";
import AboutPage from "./Pages/AboutPage";
import AllDoctorsPage from "./Pages/AllDoctorsPage";
import ChatbotPage from "./Pages/ChatbotPage";
import PrescriptionPage from "./Pages/PrescriptionPage";
import DoctorPage from "./Pages/DoctorPage";
import AppointmentPage from "./Pages/AppointmentPage";
import ProfileDocPage from "./Pages/ProfileDocPage";
import DoctorAboutPage from "./Pages/DoctorAboutPage";
import DocPrescriptionPage from "./Pages/DocPrescriptionPage.js";
import PharmacyPage from "./Pages/PharmacyPage.js";
import PatientProfilePage from "./Pages/PatientProfilePage.js";
import RoomPage from "./Pages/RoomPage.js";
import CreateRoomPage from "./Pages/CreateRoomPage.js";
import PatientMeet from "./Pages/PatientMeet.js";
import AddReportPage from "./Pages/AddReportPage.js";
import DoctorReportsPage from "./Pages/DoctorReportsPage.js";
import AdminDoctors from "./Pages/AdminDoctors.js";
import AdminPatients from "./Pages/AdminPatients.js";
import BookAppointment from "./Pages/BookAppointment.js";
import LungDiseasePage from "./Pages/LungDiseasePage.js";
import AdminDashboard from "./Pages/AdminDashboard.js";
import AdminAppointments from "./Pages/AdminAppointments.js";
import AdminAIInsights from "./Pages/AdminAIInsights.js";
import AdminChatLogs from "./Pages/AdminChatLogs.js";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/loginpatient" element={<LoginPatient />} />
          <Route exact path="/logindoc" element={<LoginDoctor />} />
          <Route exact path="/loginadmin" element={<LoginAdmin />} />
          <Route exact path="/signuppatient" element={<SignUpPatient />} />
          <Route exact path="/signupdoc" element={<SignUpDoctor />} />
          <Route exact path="/admin" element={<AdminPage />} />
          <Route exact path="/aboutpage" element={<AboutPage />} />
          <Route exact path="/alldoctors" element={<AllDoctorsPage />} />
          <Route exact path="/chatbot" element={<ChatbotPage />} />
          <Route exact path="/lung-disease" element={<LungDiseasePage />} />
          <Route
            exact
            path="/docprescription"
            element={<DocPrescriptionPage />}
          />
          <Route exact path="/doctorPage" element={<DoctorPage />} />
          <Route exact path="/appointment" element={<AppointmentPage />} />
          <Route exact path="/profileDoc" element={<ProfileDocPage />} />
          <Route exact path="/doctorabout" element={<DoctorAboutPage />} />
          <Route
            exact
            path="/prescriptionPage"
            element={<PrescriptionPage />}
          />
          <Route exact path="/pharmacy" element={<PharmacyPage />} />
          <Route
            exact
            path="/profilePatientPage"
            element={<PatientProfilePage />}
          />
          <Route exact path="/joinMeet" element={<RoomPage />} />
          <Route exact path="/joinMeet/:roomId" element={<CreateRoomPage />} />
          <Route exact path="/meet" element={<PatientMeet />} />
          <Route exact path="/reportAdd" element={<AddReportPage />} />
          <Route exact path="/doctorReport" element={<DoctorReportsPage />} />
          <Route exact path="/admindoc" element={<AdminDoctors />} />
          <Route exact path="/adminpatient" element={<AdminPatients />} />
          <Route path="/book-appointment/:doctorID" element={<BookAppointment />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
          <Route exact path="/admin-appointments" element={<AdminAppointments />} />
          <Route exact path="/admin-ai-insights" element={<AdminAIInsights />} />
          <Route exact path="/admin-chat-logs" element={<AdminChatLogs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
