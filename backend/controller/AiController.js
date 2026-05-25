const { GoogleGenerativeAI } = require("@google/generative-ai");
const { runLungInference } = require("../utils/ml_utils");
const { diseaseToSpecialty, diseaseSymptomContext } = require("../utils/diseaseData");
const Doctor = require("../models/DoctorModel");
const ChatLog = require("../models/ChatLog");
const PredictionHistory = require("../models/PredictionHistory");
const path = require("path");
const fs = require("fs");

/**
 * AI Chatbot with Symptom Diagnosis
 */
const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Construct a specialized prompt for medical diagnosis
    const systemPrompt = `
      You are an AI Telemedicine Assistant. Based on the symptoms described by the user, identify the most likely disease from the following list:
      ${diseaseSymptomContext}
      
      Instructions:
      1. If you can identify a disease, explicitly include the phrase "DESIGNATED_DISEASE: [Disease Name]" in your response.
      2. Keep the advice professional and emphasize that this is a preliminary assessment.
      3. Recommend that they consult a specialist.
      
      User Symptoms: "${prompt}"
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Extract disease if any
    let suggestedDoctors = [];
    let diseaseName = null;
    const diseaseMatch = text.match(/DESIGNATED_DISEASE:\s*([^.\n]+)/i);
    if (diseaseMatch) {
      diseaseName = diseaseMatch[1].trim();
      const specialty = diseaseToSpecialty[diseaseName];
      if (specialty) {
        suggestedDoctors = await Doctor.find({ speciality: specialty, accountStatus: 'approved' }).limit(3);
      }
    }

    // 📊 Save chat log for admin monitoring (does not affect response)
    try {
      await ChatLog.create({
        userPrompt: prompt,
        botResponse: text.replace(/DESIGNATED_DISEASE:.*(\\n|$)/i, ""),
        diseaseDiagnosed: diseaseName,
        symptomsExtracted: prompt.split(/[,;.]+/).map(s => s.trim()).filter(s => s.length > 2),
        suggestedDoctors: suggestedDoctors.map(d => ({
          doctorId: d._id,
          name: d.name,
          speciality: d.speciality,
        })),
      });
    } catch (logErr) {
      console.error("Failed to save chat log:", logErr);
    }

    res.status(200).json({ 
        success: true, 
        response: text.replace(/DESIGNATED_DISEASE:.*(\\n|$)/i, ""), // Clean up the tag from user view
        suggestedDoctors 
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ success: false, message: "AI service error", error: error.message });
  }
};

/**
 * Lung Disease Classification (X-Ray analysis)
 */
const lungClassification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an X-ray image" });
    }

    const imagePath = req.file.path;
    const result = await runLungInference(imagePath);

    // Clean up uploaded file after processing
    // fs.unlinkSync(imagePath); 

    // Find specialists for the detected lung condition
    const specialty = "Pulmonologist";
    const suggestedDoctors = await Doctor.find({ speciality: specialty, accountStatus: 'approved' }).limit(3);

    const confidenceStr = (result.confidence * 100).toFixed(2) + "%";

    // 📊 Save prediction history for admin monitoring (does not affect response)
    try {
      await PredictionHistory.create({
        imagePath: imagePath,
        prediction: result.prediction,
        confidence: confidenceStr,
        allScores: result.all_scores || {},
      });
    } catch (logErr) {
      console.error("Failed to save prediction history:", logErr);
    }

    res.status(200).json({
      success: true,
      prediction: result.prediction,
      confidence: confidenceStr,
      allScores: result.all_scores,
      suggestedDoctors
    });
  } catch (error) {
    console.error("Lung Classification Error:", error);
    res.status(500).json({ success: false, message: "Error processing image", error: error.message });
  }
};

module.exports = { chatWithAI, lungClassification };

