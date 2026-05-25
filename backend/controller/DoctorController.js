const { default: mongoose } = require("mongoose");
const DoctorModel = require("../models/DoctorModel.js");
const { sendEmail } = require("../utils/emailService");

exports.registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      image,
      price,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !image ||
      !degree ||
      !experience
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all fields", success: false });
    }

    const existingDoctor = await DoctorModel.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor already exists", success: false });
    }

    const doctor = new DoctorModel({
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      image,
      price,
    });
    await doctor.save();

    // 📧 Send Welcome Email
    const subject = "Welcome to the Medical Team!";
    const text = `Dear Dr. ${name},\n\nCongratulations on joining the AI Telemedicine platform as a healthcare provider. We are thrilled to have your expertise on board.\n\nPatients can now discover you and book appointments based on your availability.\n\nWelcome to the team!\nAI Telemedicine Administration`;
    await sendEmail(email, subject, text);
    
    // 📧 Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    await sendEmail(adminEmail, "New Doctor Registered", `A new doctor has been registered.\n\nName: Dr. ${name}\nSpeciality: ${speciality}\nEmail: ${email}`);
    
    return res
      .status(201)
      .json({ message: "Doctor created successfully", success: true, doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating doctor", success: false, error });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all fields", success: false });
    }

    const doctor = await DoctorModel.findOne({ email });
    if (!doctor || doctor.password !== password) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // 🔒 Account status gating
    if (doctor.accountStatus === 'pending') {
      return res.status(403).json({
        message: "Your account is pending admin approval. Please wait for verification.",
        success: false,
        accountStatus: 'pending'
      });
    }
    if (doctor.accountStatus === 'blocked') {
      return res.status(403).json({
        message: "Your account has been blocked by the administrator. Please contact support.",
        success: false,
        accountStatus: 'blocked'
      });
    }

    return res
      .status(200)
      .json({ message: "Login successful", success: true, doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Login failed", success: false, error });
  }
};

// exports.getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await DoctorModel.find({});
//     return res.status(200).json({ message: "All doctors fetched", success: true, doctors });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching doctors", success: false, error });
//   }
// };

exports.getAllDoctors = async (req, res) => {
  try {
    // Support optional status filter (e.g., ?status=approved for patient views)
    const filter = {};
    if (req.query.status) {
      filter.accountStatus = req.query.status;
    }

    const doctors = await DoctorModel.find(filter)
      .populate("appointments") // ✅ Ensure appointments are populated
      .populate("reports"); // ✅ Ensure reports are populated

    return res.status(200).json({
      message: "All doctors fetched",
      success: true,
      doctors,
      totalDoctors: doctors.length, // ✅ Send total count
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching doctors", success: false, error });
  }
};

exports.getSingleDoc = async (req, res) => {
  try {
    console.log("Raw request body:", req.body); // Debug log

    // Handle both possible formats:
    let doctorID;
    if (typeof req.body.doctorID === "string") {
      doctorID = req.body.doctorID;
    } else if (req.body.doctorID?.doctorID) {
      doctorID = req.body.doctorID.doctorID;
    } else {
      return res.status(400).json({
        message: "Invalid request format",
        success: false,
        receivedBody: req.body,
      });
    }

    // Now proceed with validation
    const trimmedID = doctorID.trim();
    if (!mongoose.Types.ObjectId.isValid(trimmedID)) {
      return res.status(400).json({
        message: "Invalid Doctor ID format",
        success: false,
        receivedId: trimmedID,
      });
    }

    const doctor = await DoctorModel.findById(trimmedID).populate(
      "appointments"
    );
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    return res.status(200).json({
      message: "Doctor details fetched",
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error fetching doctor",
      success: false,
      error: error.message,
    });
  }
};

exports.getDocForAppointment = async (req, res) => {
  try {
    const { doctorID, patientID, appointmentDate, timeSlot } = req.body;

    if (!doctorID || !patientID || !appointmentDate || !timeSlot) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const doctor = await DoctorModel.findById(doctorID);
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    const isSlotTaken = doctor.appointments.some(
      (appointment) =>
        appointment.date === appointmentDate &&
        appointment.timeSlot === timeSlot
    );

    if (isSlotTaken) {
      return res
        .status(400)
        .json({ message: "Time slot already booked", success: false });
    }

    doctor.appointments.push({ patientID, date: appointmentDate, timeSlot });
    await doctor.save();

    return res.status(200).json({
      message: "Appointment booked successfully",
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error booking appointment", success: false, error });
  }
};

exports.createReport = async (req, res) => {
  try {
    const {
      doctorID,
      BP,
      weight,
      height,
      sugar,
      surgeries,
      heartrate,
      pulserate,
      image,
      name,
      patientID,
    } = req.body;
    const doctor = await DoctorModel.findByIdAndUpdate(
      doctorID,
      {
        $push: {
          reports: {
            BP,
            weight,
            height,
            sugar,
            surgeries,
            heartrate,
            pulserate,
            image,
            name,
            patientID,
          },
        },
      },
      { new: true }
    ).populate({
        path: 'reports.patientID',
        model: 'Patient'
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    // 📧 Notify Patient (assuming the last report is the one just added)
    const report = doctor.reports[doctor.reports.length - 1];
    if (report && report.patientID) {
        const patient = report.patientID;
        const subject = "Medical Report from Dr. " + doctor.name;
        const text = `Dear ${patient.name},\n\nDr. ${doctor.name} has created a new medical report for you.\n\nBP: ${BP}\nWeight: ${weight}\nHeight: ${height}\n\nPlease check your portal to view the full report.`;
        await sendEmail(patient.email, subject, text);

        // 📧 Notify Admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
        await sendEmail(adminEmail, "New Doctor Report", `Dr. ${doctor.name} has uploaded a new report for ${patient.name}.`);
    }

    return res
      .status(200)
      .json({ message: "Report created successfully", success: true, doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating report", success: false, error });
  }
};
