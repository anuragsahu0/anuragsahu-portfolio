const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * MongoDB Connection Handler
 * Connects to Mongoose URI if provided, caches connection for serverless lambdas.
 */
const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('⚠️  MONGODB CONNECTION NOTICE: MONGODB_URI not set. Running in static-fallback mode.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };
    cached.promise = mongoose.connect(mongoURI, opts).then((m) => {
      console.log(`🍃 MONGODB CONNECTED: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.log(`⚠️  MONGODB CONNECTION ERROR: ${err.message}`);
    return null;
  }
};

module.exports = connectDB;

