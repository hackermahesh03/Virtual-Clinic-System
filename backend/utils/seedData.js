const mongoose = require("mongoose");
const Doctor = require("../models/DoctorModel");
const Patient = require("../models/PatientModel");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// console.log("MONGO_URI:", process.env.MONGO_URI);

const doctorsData = [
  {
    name: "Dr. Sarah Smith",
    email: "sarah.smith@qriocity.com",
    password: "password123",
    speciality: "Pulmonologist",
    degree: "MBBS, MD (Pulmonary Medicine)",
    experience: "12 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
    price: 800,
    availableSlots: [
      { date: "2026-04-12", times: ["10:00 AM", "11:00 AM", "02:00 PM"] },
      { date: "2026-04-13", times: ["09:00 AM", "12:00 PM"] }
    ]
  },
  {
    name: "Dr. David Jones",
    email: "david.jones@qriocity.com",
    password: "password123",
    speciality: "Dermatologist",
    degree: "MBBS, DVD",
    experience: "8 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
    price: 600,
    availableSlots: [
      { date: "2026-04-12", times: ["03:00 PM", "04:00 PM"] }
    ]
  },
  {
    name: "Dr. Elena Rodriguez",
    email: "elena.r@qriocity.com",
    password: "password123",
    speciality: "General Physician",
    degree: "MBBS",
    experience: "15 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/female/3.jpg",
    price: 500,
    availableSlots: [
      { date: "2026-04-12", times: ["09:00 AM", "10:00 AM", "11:00 AM"] }
    ]
  },
  {
    name: "Dr. James Wilson",
    email: "james.w@qriocity.com",
    password: "password123",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD, DM (Gastro)",
    experience: "10 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/male/4.jpg",
    price: 900,
    availableSlots: [
      { date: "2026-04-14", times: ["11:00 AM", "01:00 PM"] }
    ]
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.c@qriocity.com",
    password: "password123",
    speciality: "Neurologist",
    degree: "MBBS, MD, DM (Neurology)",
    experience: "20 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/male/5.jpg",
    price: 1200,
    availableSlots: [
      { date: "2026-04-12", times: ["10:00 AM", "12:00 PM"] }
    ]
  },
  {
    name: "Dr. Sophia Brown",
    email: "sophia.b@qriocity.com",
    password: "password123",
    speciality: "Cardiologist",
    degree: "MBBS, MD, DM (Cardio)",
    experience: "14 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/female/6.jpg",
    price: 1500,
    availableSlots: [
      { date: "2026-04-15", times: ["02:00 PM", "03:00 PM"] }
    ]
  },
  {
    name: "Dr. Robert Taylor",
    email: "robert.t@qriocity.com",
    password: "password123",
    speciality: "Urologist",
    degree: "MBBS, MS, MCh (Urology)",
    experience: "11 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/male/7.jpg",
    price: 1000,
    availableSlots: [
      { date: "2026-04-12", times: ["04:00 PM", "05:00 PM"] }
    ]
  },
  {
    name: "Dr. Lisa Wang",
    email: "lisa.w@qriocity.com",
    password: "password123",
    speciality: "Rheumatologist",
    degree: "MBBS, MD (Medicine)",
    experience: "9 Years",
    image: "https://xsgames.co/randomusers/assets/avatars/female/8.jpg",
    price: 700,
    availableSlots: [
      { date: "2026-04-13", times: ["10:00 AM", "11:00 AM"] }
    ]
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_telemedicine";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing doctors (optional, but good for a fresh start in this case)
    await Doctor.deleteMany({ email: { $in: doctorsData.map(d => d.email) } });
    
    await Doctor.insertMany(doctorsData);
    console.log("Doctors seeded successfully!");

    // Seed a sample patient if none exists
    const patientExists = await Patient.findOne({ email: "patient@example.com" });
    if (!patientExists) {
        await Patient.create({
            name: "John Doe",
            email: "patient@example.com",
            password: "password123",
            phone: "1234567890",
            address: "123 Main St, New York",
            gender: "Male",
            dob: "1990-01-01",
            image: "https://xsgames.co/randomusers/assets/avatars/male/10.jpg"
        });
        console.log("Sample patient seeded!");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();
