const PatientModel = require("../models/PatientModel");
const { sendEmail } = require("../utils/emailService");

// 





exports.registerPatient = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields", success: false });
    }

    const existingPatient = await PatientModel.findOne({ email });
    if (existingPatient) {
      return res.status(401).json({ message: "User already exists", success: false });
    }

    // Create a new patient
    const patient = new PatientModel({ name, password, email });
    await patient.save();

    // 📧 Send Welcome Email
    const subject = "Welcome to AI Telemedicine!";
    const text = `Dear ${name},\n\nThank you for registering as a Patient on our AI Telemedicine platform. We are committed to providing you with the best healthcare experience.\n\nYou can now log in to your account and book appointments with our expert doctors.\n\nStay healthy!\nAI Telemedicine Team`;
    await sendEmail(email, subject, text);

    // 📧 Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    await sendEmail(adminEmail, "New Patient Registration", `A new patient has registered.\n\nName: ${name}\nEmail: ${email}`);

    return res.status(201).json({
      message: "Patient created successfully",
      success: true,
      patient: {
        _id: patient._id,  // Ensure frontend gets patient ID
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    return res.status(500).json({ message: "Error creating patient", success: false, error });
  }
};

// Login Patient
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields", success: false });
    }

    const patient = await PatientModel.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "User doesn't exist", success: false });
    }

    if (password !== patient.password) {
      return res.status(401).json({ message: "Password does not match", success: false });
    }

    // 🔒 Account status gating
    if (patient.accountStatus === 'blocked') {
      return res.status(403).json({
        message: "Your account has been blocked by the administrator. Please contact support.",
        success: false,
        accountStatus: 'blocked'
      });
    }

    return res.status(200).json({
      message: "User login successful",
      success: true,
      patient: {
        _id: patient._id,  // Ensure correct ID is sent
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({ message: "User login failed", success: false, error });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find({});
    res.status(200).send({
      totalPatients: patients.length,
      message: "All patients",
      success: true,
      patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting patients",
      success: false,
      error,
    });
  }
};

// exports.getSinglePatient = async (req, res) => {
//   try {
//     const { patientID } = req.body;
//     const patient = await PatientModel.findById(patientID);
//     if (!patient) {
//       return res.status(400).send({
//         message: "Error getting pateint",
//         success: false,
//       });
//     }
//     return res.status(200).send({
//       message: "Patient fetched sucessfully",
//       success: true,
//       patient,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Error getting patient",
//       success: false,
//       error,
//     });
//   }
// };



exports.getSinglePatient = async (req, res) => {
  try {
    const { patientID } = req.body;
    const patient = await PatientModel.findById(patientID).populate("appointments");
    if (!patient) {
      return res.status(400).send({
        message: "Error getting patient",
        success: false,
      });
    }
    return res.status(200).send({
      message: "Patient fetched successfully",
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error getting patient",
      success: false,
      error,
    });
  }
};


exports.createPresecreption = async (req, res) => {
  try {
    const { patientID, docname, note, medicine } = req.body;
    const patient = await PatientModel.findByIdAndUpdate(
      patientID,
      {
        $push: {
          prescription: {
            docname: docname,
            note: note,
            medicine: medicine,
          },
        },
      },
      { new: true }
    );
    await patient.save();

    // 📧 Notify Patient
    const subject = "New Prescription Added";
    const text = `Dear ${patient.name},\n\nA new prescription from Dr. ${docname} has been added to your profile.\n\nNotes: ${note}\nMedicine: ${medicine}\n\nPlease check your profile for more details.`;
    await sendEmail(patient.email, subject, text);

    return res.status(200).send({
      message: "Precription created sucessfully",
      success: true,
      patient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error creating presecription",
      success: false,
      error,
    });
  }
};

exports.createReport = async (req, res) => {
  try {
    const {
      patientID,
      BP,
      weight,
      height,
      sugar,
      surgeries,
      heartrate,
      pulserate,
      image,
    } = req.body;
    let patient = await PatientModel.findByIdAndUpdate(
      patientID,
      {
        $push: {
          reports: {
            BP: BP,
            weight: weight,
            height: height,
            sugar: sugar,
            surgeries: surgeries,
            heartrate: heartrate,
            pulserate: pulserate,
            image: image,
          },
        },
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).send({
        message: "Patient not found",
        success: false,
      });
    }

    await patient.save();

    // 📧 Notify Patient
    const subject = "New Medical Report Available";
    const text = `Dear ${patient.name},\n\nA new medical report has been uploaded to your profile.\n\nSummary:\nBP: ${BP}\nWeight: ${weight}\nHeight: ${height}\nSugar: ${sugar}\n\nPlease check your profile for the full report and image.`;
    await sendEmail(patient.email, subject, text);

    // 📧 Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    await sendEmail(adminEmail, "New Medical Report Uploaded", `A new report has been uploaded for Patient: ${patient.name} (ID: ${patientID}).`);

    return res.status(200).send({
      message: "Report created successfully",
      success: true,
      patient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error creating report",
      success: false,
      error,
    });
  }
};
