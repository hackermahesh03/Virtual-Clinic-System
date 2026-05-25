const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  blockDoctor,
  unblockDoctor,
  blockPatient,
  unblockPatient,
  getAllAppointments,
  getChatLogs,
  getChatStats,
  getPredictionHistory,
  getPredictionStats,
} = require("../controller/AdminController");

// 📊 Dashboard
router.get("/stats", getDashboardStats);

// 👨‍⚕️ Doctor Verification
router.get("/pending-doctors", getPendingDoctors);
router.put("/approve-doctor/:id", approveDoctor);
router.delete("/reject-doctor/:id", rejectDoctor);
router.put("/block-doctor/:id", blockDoctor);
router.put("/unblock-doctor/:id", unblockDoctor);

// 🧑 Patient Management
router.put("/block-patient/:id", blockPatient);
router.put("/unblock-patient/:id", unblockPatient);

// 📋 Appointments
router.get("/appointments", getAllAppointments);

// 💬 Chatbot Monitoring
router.get("/chat-logs", getChatLogs);
router.get("/chat-stats", getChatStats);

// 🫁 AI/ML Prediction Insights
router.get("/prediction-history", getPredictionHistory);
router.get("/prediction-stats", getPredictionStats);

module.exports = router;
