// const mongoose = require("mongoose");

// const doctorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   speciality: {
//     type: String,
//     required: true,
//   },
//   degree: {
//     type: String,
//     required: true,
//   },
//   experience: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//   },
//   availableSlots: [
//     {
//       date: { type: String, required: true },
//       times: [{ type: String, required: true }],
//     }
//   ],
//   appointments: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Patient",
//     },
//   ],
//   reports: [
//     {
//       BP: {
//         type: Number,
//       },
//       weight: {
//         type: Number,
//       },
//       height: {
//         type: Number,
//       },
//       sugar: {
//         type: Number,
//       },
//       surgeries: {
//         type: String,
//       },
//       heartrate: {
//         type: Number,
//       },
//       pulserate: {
//         type: Number,
//       },
//       image: {
//         type: String,
//       },
//       name: {
//         type: String,
//       },
//       patientID: {
//         type: String,
//       },
//     },
//   ],
// });

// const Doctor = mongoose.model("Doctor", doctorSchema);
// module.exports = Doctor;





const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number },
  accountStatus: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
  availableSlots: [
    {
      date: { type: String, required: true },
      times: [{ type: String, required: true }],
    }
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // 🔹 Reference Appointment model
    },
  ],
  reports: [
    {
      patientID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
      name: { type: String, required: true },
      BP: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      sugar: { type: Number },
      surgeries: { type: String },
      heartrate: { type: Number },
      pulserate: { type: Number },
      image: { type: String },
      date: { type: Date, default: Date.now }, // ✅ Include timestamp for reports
    },
  ],
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;











