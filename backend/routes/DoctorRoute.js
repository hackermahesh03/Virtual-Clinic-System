const {
  registerDoctor,
  loginDoctor,
  getAllDoctors,
  getDocForAppointment,
  getSingleDoc,
  createReport,
} = require("../controller/DoctorController.js");

const express = require("express");
const router = express.Router();

router.post("/createDoctor", registerDoctor);
router.post("/loginDoctor", loginDoctor);
router.get("/allDoctors", getAllDoctors);
router.post("/singleDoc", getSingleDoc);
router.post("/bookAppointment", getDocForAppointment);

router.post("/createReport", createReport);
module.exports = router;
