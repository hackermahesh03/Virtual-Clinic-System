const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  doctorID: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  date: { type: String, required: true }, // Store in YYYY-MM-DD format
  time: { type: String, required: true }, // Store in HH:MM format
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
