const express = require("express");
const connectDB = require("./backend/config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const DoctorRoutes = require("./backend/routes/DoctorRoute.js");
const PatientRoutes = require("./backend/routes/PatientRoutes.js");
const AppointmentRoutes = require("./backend/routes/AppointmentRoute.js");
const PaymentRoutes = require("./backend/routes/PaymentRoutes.js");
const AiRoutes = require("./backend/routes/AiRoute.js");
const AdminRoutes = require("./backend/routes/AdminRoutes.js");

// ✅ Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads/ folder");
}

connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

app.use("/api/v1/doctors", DoctorRoutes);
app.use("/api/v1/patients", PatientRoutes);
app.use("/api/v1/appointments", AppointmentRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/ai", AiRoutes);
app.use("/api/v1/admin", AdminRoutes);

app.listen(2000, () => {
  console.log("Server Working on port 2000");
});