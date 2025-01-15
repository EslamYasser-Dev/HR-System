import mongoose from "mongoose";
import "dotenv/config"; // Ensure this line is at the top of your main entry file

async function dBConnection() {
  const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/rfDatabase";

  try {
    await mongoose.connect(url);
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(`MongoDB connection error 🤬: ${error}`);
    });
    db.once("open", () => {
      console.log("\n===========================✅ Connected to MongoDB ===========================\n");
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

export default dBConnection;
