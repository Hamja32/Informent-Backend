const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const conn = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection successfully");
  } catch (error) {
    console.log(error);
    console.log("Error in conn js");
  }
};
conn();
