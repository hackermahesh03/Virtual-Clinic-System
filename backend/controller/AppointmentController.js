const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/DoctorModel");
const Patient = require("../models/PatientModel");
const { sendEmail } = require("../utils/emailService");
const moment = require("moment");

const bookAppointment = async (req, res) => {
  try {
    let { doctorID, patientID, date, time } = req.body;
    console.log("Received Booking Request:", req.body);

    // 🛑 Validate required fields
    if (!doctorID || !patientID || !date || !time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 🕒 Check if the appointment is in the past
    const requestedDateTime = moment(`${date} ${time}`, "YYYY-MM-DD h:mm A");
    if (requestedDateTime.isBefore(moment().add(30, 'minutes'))) {
      return res.status(400).json({ 
        success: false, 
        message: "Appointments must be booked at least 30 minutes in advance. Please choose a future time slot." 
      });
    }

    // ✅ Ensure doctorID and patientID are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(doctorID) || !mongoose.Types.ObjectId.isValid(patientID)) {
      return res.status(400).json({ success: false, message: "Invalid doctorID or patientID format" });
    }

    // 🔹 Convert IDs to ObjectId only if they are strings
    if (typeof doctorID === "string") doctorID = new mongoose.Types.ObjectId(doctorID);
    if (typeof patientID === "string") patientID = new mongoose.Types.ObjectId(patientID);

    console.log("Converted doctorID:", doctorID);
    console.log("Converted patientID:", patientID);

    // 🔍 Check if the doctor exists
    const doctor = await Doctor.findById(doctorID);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 🔍 Check if the patient exists
    const patient = await Patient.findById(patientID);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // ⏳ Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({ doctorID, date, time });
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: "Time slot already booked" });
    }

    // ✅ Create a new appointment
    const newAppointment = new Appointment({
      doctorID,
      patientID,
      date,
      time,
      status: "Pending", // Default status
    });

    await newAppointment.save();

    // 📧 Send Confirmation Email
    const subject = "Appointment Booking Confirmed";
    const text = `Dear ${patient.name},\n\nYour appointment with Dr. ${doctor.name} has been successfully booked for ${date} at ${time}.\n\nYou can access the meeting page in the application to connect with the doctor.\n\nThank you!`;
    await sendEmail(patient.email, subject, text);

    // 📧 Notify Doctor
    const docSubject = "New Appointment Booked";
    const docText = `Dear Dr. ${doctor.name},\n\nA new appointment has been booked by ${patient.name} for ${date} at ${time}.\n\nPlease check your portal for details.`;
    await sendEmail(doctor.email, docSubject, docText);

    // 📧 Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminSubject = "New Appointment Alert";
    const adminText = `A new appointment has been booked.\n\nPatient: ${patient.name}\nDoctor: Dr. ${doctor.name}\nDate: ${date}\nTime: ${time}`;
    await sendEmail(adminEmail, adminSubject, adminText);

    res.status(201).json({ success: true, message: "Appointment booked successfully", appointment: newAppointment });

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Function to Get Appointments by Patient ID
const getAppointmentsByPatient = async (req, res) => {
  try {
    let { patientID } = req.query;

    // 🛑 Check if patientID is provided
    if (!patientID) {
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }

    // ✅ Convert patientID to ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientID)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID format" });
    }

    patientID = new mongoose.Types.ObjectId(patientID);

    // 🔍 Fetch all appointments for the patient
    const appointments = await Appointment.find({ patientID }).populate("doctorID");

    res.status(200).json({ success: true, appointments });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Function to Get Appointments by Doctor ID
const getAppointmentsByDoctor = async (req, res) => {
  try {
    let { doctorID } = req.query;

    if (!doctorID) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorID)) {
      return res.status(400).json({ success: false, message: "Invalid Doctor ID format" });
    }

    doctorID = new mongoose.Types.ObjectId(doctorID);

    const appointments = await Appointment.find({ doctorID }).populate("patientID");

    res.status(200).json({ success: true, appointments });

  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Function to Cancel an Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentID)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
    }

    const appointment = await Appointment.findByIdAndDelete(appointmentID).populate("doctorID").populate("patientID");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // 📧 Notify Patient (if available)
    if (appointment.patientID) {
      const subject = "Appointment Cancellation";
      const text = `Dear ${appointment.patientID.name},\n\nYour appointment scheduled for ${appointment.date} at ${appointment.time} has been canceled.\n\nIf you have any questions, please contact us.`;
      await sendEmail(appointment.patientID.email, subject, text);
    }

    // 📧 Notify Doctor (if available)
    if (appointment.doctorID) {
      const docSubject = "Appointment Canceled by Patient";
      const docText = `Dear Dr. ${appointment.doctorID.name},\n\nThe appointment with ${appointment.patientID?.name || "a patient"} scheduled for ${appointment.date} at ${appointment.time} has been canceled.`;
      await sendEmail(appointment.doctorID.email, docSubject, docText);
    }

    // 📧 Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    await sendEmail(adminEmail, "Appointment Canceled", `An appointment has been canceled.\n\nAppointment ID: ${appointmentID}\nDate: ${appointment.date}\nTime: ${appointment.time}`);

    res.status(200).json({ success: true, message: "Appointment cancelled successfully" });

  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Function to Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentID } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentID)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentID,
      { status },
      { new: true }
    ).populate("patientID").populate("doctorID");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // 📧 Notify Patient about status update
    if (appointment.patientID) {
        const subject = "Appointment Status Updated";
        const text = `Dear ${appointment.patientID.name},\n\nYour appointment with Dr. ${appointment.doctorID?.name || "your doctor"} scheduled for ${appointment.date} at ${appointment.time} is now marked as: ${status}.\n\nThank you!`;
        await sendEmail(appointment.patientID.email, subject, text);
    }

    res.status(200).json({ success: true, message: "Appointment status updated", appointment });

  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  cancelAppointment,
  updateAppointmentStatus,
};
