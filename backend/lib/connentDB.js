

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if DATABASE environment variable exists
    if (!process.env.DATABASE) {
      throw new Error('DATABASE environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(process.env.DATABASE, {
     // useNewUrlParser: true,
    //  useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout for Atlas
      socketTimeoutMS: 45000,
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;





