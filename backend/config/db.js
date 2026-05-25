// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       `mongodb+srv://someshrocks144:somesh2004@cluster0.bmkdkfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//     );
//     console.log("Connected");
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_telemedicine";
    await mongoose.connect(uri);
    console.log(`MongoDB Connected ✅ (${uri})`);
  } catch (error) {
    console.log("MongoDB Connection Error ❌", error);
  }
};

module.exports = connectDB;