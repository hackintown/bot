const mongoose = require("mongoose");
require("dotenv").config();

async function fixEmailIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Drop the problematic index
    await mongoose.connection.collection("users").dropIndex("email_1");
    console.log("Successfully dropped email index");

    // Optional: Create a new sparse index if needed
    // await mongoose.connection.collection('users').createIndex({ email: 1 }, { sparse: true });
    // console.log('Created new sparse email index');
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

fixEmailIndex();
