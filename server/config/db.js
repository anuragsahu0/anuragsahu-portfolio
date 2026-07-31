const mongoose = require('mongoose');

/**
 * MongoDB Connection Handler
 * Connects to Mongoose URI if provided, or operates gracefully in memory-fallback mode.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_gravity_portfolio';

  // Fail immediately instead of buffering for 10s when DB is unavailable
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`🍃 MONGODB CONNECTED: ${conn.connection.host}`);
  } catch (err) {
    console.log(`⚠️  MONGODB CONNECTION NOTICE: Running in static-fallback mode (${err.message})`);
  }
};

module.exports = connectDB;

