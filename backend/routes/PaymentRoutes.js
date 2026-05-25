const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");
const Appointment = require("../models/Appointment");
const Patient = require("../models/PatientModel");

const router = express.Router();

// 🔑 Initialize Razorpay instance using env variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ 1️⃣ Create Razorpay Order
router.post("/create-order", async (req, res) => {
    console.log("Received request at /create-order");
  try {
    const { amount } = req.body; // Amount in INR

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order_id: order.id, amount: order.amount });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// ✅ 2️⃣ Verify Razorpay Payment
router.post("/verify", async (req, res) => {
  try {
    const { appointmentID, paymentID, orderID, signature } = req.body;

    // 🔐 Generate hash (HMAC SHA256)
    const body = `${orderID}|${paymentID}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 💾 Update Appointment Payment Status (Optional)
    const appointment = await Appointment.findById(appointmentID).populate("patientID");
    if (appointment && appointment.patientID) {
        // 📧 Send Payment Confirmation Email
        const patient = appointment.patientID;
        const subject = "Payment Confirmation";
        const text = `Dear ${patient.name},\n\nYour payment for the appointment has been confirmed. We will let you know shortly when the doctor can connect with you.\n\nThank you!`;
        await sendEmail(patient.email, subject, text);

        // 📧 Notify Admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
        await sendEmail(adminEmail, "Payment Successful", `A payment has been successfully verified for Patient: ${patient.name}.\n\nAppointment ID: ${appointmentID}\nPayment ID: ${paymentID}`);
    }

    res.json({ success: true, message: "Payment verified successfully!" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
