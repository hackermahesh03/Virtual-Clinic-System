const mongoose = require("mongoose");

const predictionHistorySchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: String, required: true },
  allScores: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const PredictionHistory = mongoose.model("PredictionHistory", predictionHistorySchema);
module.exports = PredictionHistory;
