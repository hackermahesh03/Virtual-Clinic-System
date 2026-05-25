const express = require("express");
const {
  registerPatient,
  getAllPatients,
  loginPatient,
  getSinglePatient,
  createPresecreption,
  createReport,
} = require("../controller/PatientController");
const router = express.Router();

router.post("/createPatient", registerPatient);
router.post("/loginPatient", loginPatient);
router.get("/getAllPatient", getAllPatients);
router.post("/getSinglePatient", getSinglePatient);
router.post("/createPrescription", createPresecreption);
router.post("/createreport", createReport);
module.exports = router;
