const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const conn = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri);
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.log("Connection Error ❌:", error.message);
  }
};

conn();
