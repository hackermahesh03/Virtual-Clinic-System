const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  userPrompt: { type: String, required: true },
  botResponse: { type: String, required: true },
  diseaseDiagnosed: { type: String, default: null },
  symptomsExtracted: [{ type: String }],
  suggestedDoctors: [
    {
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      name: { type: String },
      speciality: { type: String },
    },
  ],
}, { timestamps: true });

const ChatLog = mongoose.model("ChatLog", chatLogSchema);
module.exports = ChatLog;
