const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountStatus: { type: String, enum: ['active', 'blocked'], default: 'active' },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],

  prescription: [
    {
      docname: {
        type: String,
      },
      note: {
        type: String,
      },
      medicine: {
        type: String,
      },
    },
  ],
  reports: [
    {
      BP: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      height: {
        type: Number,
      },
      sugar: {
        type: Number,
      },
      surgeries: {
        type: String,
      },
      heartrate: {
        type: Number,
      },
      pulserate: {
        type: Number,
      },
      image: {
        type: String,
      },
    },
  ],
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
