const mongoose = require('mongoose');

/**
 * MongoDB Connection Handler
 * Connects to Mongoose URI if provided, or operates gracefully in memory-fallback mode.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_gravity_portfolio';

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`🍃 MONGODB CONNECTED: ${conn.connection.host}`);
  } catch (err) {
    console.log(`⚠️  MONGODB CONNECTION NOTICE: Running in static-fallback mode (${err.message})`);
  }
};

module.exports = connectDB;

