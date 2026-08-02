const mongoose = require("mongoose");

async function connectDatabase(mongodbUri) {
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is missing. Check your environment variables.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongodbUri);
  console.log("Connected to MongoDB Atlas");
}

module.exports = connectDatabase;
