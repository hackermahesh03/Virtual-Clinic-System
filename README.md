# AI Telemedicine Platform (Qriocity Doctor)

A comprehensive, AI-powered telemedicine solution designed to bridge the gap between patients and healthcare professionals. The platform leverages cutting-edge AI for initial consultations, real-time video streaming for remote appointments, and integrated payment gateways for seamless transactions.

## 🚀 Features

### For Patients
- **AI Health Assistant**: Included ML model to predict Lung diseases using X-ray and Google Gemini AI for initial symptom analysis and medical queries.
- **Appointment Booking**: Easy scheduling with doctors based on availability.
- **Secure Payments**: Integrated Razorpay for safe and quick consultation fee payments.
- **Video Consultations**: High-quality video calls powered by Zegocloud for face-to-face remote meetings.
- **E-Prescriptions & Reports**: Access and download prescriptions and medical reports in DOCX format.
- **Pharmacy Section**: Browse and manage medical requirements.

### For Doctors
- **Patient Management**: View and manage appointments, medical history, and reports.
- **Digital Prescriptions**: Generate and issue digital prescriptions during or after consultations.
- **Earnings Dashboard**: Track consultation fees and payment status.
- **Professional Profile**: Showcase expertise, experience, and availability.

### For Admins
- **Database Control**: Manage the full list of registered doctors and patients.
- **System Monitoring**: Oversee platform activity and verify user credentials.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React.js
- **Styling:** Tailwind CSS & Bootstrap
- **Real-time Communication:** Zegocloud UI Kit
- **Maps:** Leaflet & React-Leaflet
- **AI Interactions:** Google Generative AI (@google/generative-ai)

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **AI Engine:** Google Gemini (Gemini 2.5 Flash Lite)
- **Payment Gateway:** Razorpay
- **Email Service:** Nodemailer

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

---

## ⚙️ Installation & Setup

2. **Install Dependencies:**
   
   *Root (Backend):*
   ```bash
   npm install
   ```

   *Frontend:*
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Backend Configuration
   PORT=2000
   MONGO_URI=mongodb://127.0.0.1:27017/ai_telemedicine

   # AI Credentials
   GEMINI_API_KEY=your_google_gemini_api_key

   # Payment Credentials
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email Credentials
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Run the Application:**

   *Start the Backend:*
   ```bash
   # From the root directory
   npm start
   ```

   *Start the Frontend:*
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```text
.
├── backend/            # Backend logic (MVC architecture)
│   ├── config/         # Database and third-party configs
│   ├── controller/     # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   └── utils/          # Helper functions
├── frontend/           # React application
│   ├── public/         # Static assets
│   └── src/
│       ├── Components/ # Reusable UI components
│       ├── Pages/      # Application screens
│       └── App.js      # Main routing
├── Server.js           # Server entry point
├── package.json        # Backend dependencies
└── models.json         # Reference for AI models
```

---

## 🛡️ Security & Performance
- **Environment Management**: sensitive keys are managed via `.env`.
- **Error Handling**: Comprehensive error logic in AI and Payment controllers.
- **Dynamic Loading**: Optimized React components for better UX.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
