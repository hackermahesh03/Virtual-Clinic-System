const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  cancelAppointment,
  updateAppointmentStatus,
} = require("../controller/AppointmentController");

router.post("/book", bookAppointment);
router.get("/", (req, res) => {
  if (req.query.patientID) {
    return getAppointmentsByPatient(req, res);
  }
  return getAppointmentsByDoctor(req, res);
});
router.delete("/:appointmentID", cancelAppointment);
router.put("/:appointmentID", updateAppointmentStatus);

module.exports = router;