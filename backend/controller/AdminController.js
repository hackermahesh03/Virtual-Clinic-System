const Doctor = require("../models/DoctorModel");
const Patient = require("../models/PatientModel");
const Appointment = require("../models/Appointment");
const ChatLog = require("../models/ChatLog");
const PredictionHistory = require("../models/PredictionHistory");
const { sendEmail } = require("../utils/emailService");

// 📊 Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ accountStatus: "pending" });
    const approvedDoctors = await Doctor.countDocuments({ accountStatus: "approved" });
    const blockedDoctors = await Doctor.countDocuments({ accountStatus: "blocked" });
    const blockedPatients = await Patient.countDocuments({ accountStatus: "blocked" });
    const totalChatQueries = await ChatLog.countDocuments();
    const totalPredictions = await PredictionHistory.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingDoctors,
        approvedDoctors,
        blockedDoctors,
        blockedPatients,
        totalChatQueries,
        totalPredictions,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// 🔍 Get Pending Doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ accountStatus: "pending" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ success: false, message: "Error fetching pending doctors" });
  }
};

// ✅ Approve Doctor
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "approved" },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // 📧 Notify Doctor
    await sendEmail(
      doctor.email,
      "Account Approved — AI CareNet",
      `Dear Dr. ${doctor.name},\n\nGreat news! Your account has been approved by the administrator. You can now log in and start accepting appointments.\n\nWelcome aboard!\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Doctor approved successfully", doctor });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ success: false, message: "Error approving doctor" });
  }
};

// ❌ Reject Doctor
exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // 📧 Notify Doctor
    await sendEmail(
      doctor.email,
      "Registration Rejected — AI CareNet",
      `Dear Dr. ${doctor.name},\n\nWe regret to inform you that your registration has been rejected by the administrator. If you believe this was a mistake, please contact support.\n\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Doctor rejected and removed" });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ success: false, message: "Error rejecting doctor" });
  }
};

// 🚫 Block Doctor
exports.blockDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "blocked" },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    await sendEmail(
      doctor.email,
      "Account Blocked — AI CareNet",
      `Dear Dr. ${doctor.name},\n\nYour account has been blocked by the administrator. Please contact support for further assistance.\n\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Doctor blocked", doctor });
  } catch (error) {
    console.error("Error blocking doctor:", error);
    res.status(500).json({ success: false, message: "Error blocking doctor" });
  }
};

// 🔓 Unblock Doctor
exports.unblockDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "approved" },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    await sendEmail(
      doctor.email,
      "Account Unblocked — AI CareNet",
      `Dear Dr. ${doctor.name},\n\nYour account has been unblocked. You can now log in and resume your practice on our platform.\n\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Doctor unblocked", doctor });
  } catch (error) {
    console.error("Error unblocking doctor:", error);
    res.status(500).json({ success: false, message: "Error unblocking doctor" });
  }
};

// 🚫 Block Patient
exports.blockPatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "blocked" },
      { new: true }
    );
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    await sendEmail(
      patient.email,
      "Account Blocked — AI CareNet",
      `Dear ${patient.name},\n\nYour account has been blocked by the administrator. Please contact support for further assistance.\n\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Patient blocked", patient });
  } catch (error) {
    console.error("Error blocking patient:", error);
    res.status(500).json({ success: false, message: "Error blocking patient" });
  }
};

// 🔓 Unblock Patient
exports.unblockPatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { accountStatus: "active" },
      { new: true }
    );
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    await sendEmail(
      patient.email,
      "Account Unblocked — AI CareNet",
      `Dear ${patient.name},\n\nYour account has been unblocked. You can now log in and use our platform again.\n\nAI CareNet Administration`
    );

    res.status(200).json({ success: true, message: "Patient unblocked", patient });
  } catch (error) {
    console.error("Error unblocking patient:", error);
    res.status(500).json({ success: false, message: "Error unblocking patient" });
  }
};

// 📋 Get All Appointments (Master View)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("doctorID", "name email speciality image")
      .populate("patientID", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, appointments, total: appointments.length });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ success: false, message: "Error fetching appointments" });
  }
};

// 💬 Get Chat Logs
exports.getChatLogs = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { userPrompt: { $regex: search, $options: "i" } },
          { diseaseDiagnosed: { $regex: search, $options: "i" } },
          { botResponse: { $regex: search, $options: "i" } },
        ],
      };
    }

    const logs = await ChatLog.find(filter).sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, logs, total: logs.length });
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    res.status(500).json({ success: false, message: "Error fetching chat logs" });
  }
};

// 📊 Chat Stats
exports.getChatStats = async (req, res) => {
  try {
    const totalQueries = await ChatLog.countDocuments();

    // Aggregate common symptoms
    const symptomAgg = await ChatLog.aggregate([
      { $unwind: "$symptomsExtracted" },
      { $group: { _id: { $toLower: "$symptomsExtracted" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Aggregate common diseases diagnosed
    const diseaseAgg = await ChatLog.aggregate([
      { $match: { diseaseDiagnosed: { $ne: null } } },
      { $group: { _id: "$diseaseDiagnosed", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      totalQueries,
      topSymptoms: symptomAgg.map((s) => ({ symptom: s._id, count: s.count })),
      topDiseases: diseaseAgg.map((d) => ({ disease: d._id, count: d.count })),
    });
  } catch (error) {
    console.error("Error fetching chat stats:", error);
    res.status(500).json({ success: false, message: "Error fetching chat stats" });
  }
};

// 🫁 Get Prediction History
exports.getPredictionHistory = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = { prediction: { $regex: search, $options: "i" } };
    }

    const predictions = await PredictionHistory.find(filter).sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, predictions, total: predictions.length });
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    res.status(500).json({ success: false, message: "Error fetching prediction history" });
  }
};

// 🥧 Prediction Stats (for Pie Chart)
exports.getPredictionStats = async (req, res) => {
  try {
    const stats = await PredictionHistory.aggregate([
      { $group: { _id: "$prediction", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: stats.map((s) => ({ name: s._id, value: s.count })),
    });
  } catch (error) {
    console.error("Error fetching prediction stats:", error);
    res.status(500).json({ success: false, message: "Error fetching prediction stats" });
  }
};
