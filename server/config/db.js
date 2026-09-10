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
    if (process.env.NODE_ENV !== 'production') {
      console.log('ℹ️ MONGODB NOTICE: MONGODB_URI not set. Running in lightweight fallback mode.');
    }
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
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🍃 MONGODB CONNECTED: host=${m.connection.host}`);
      }
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    if (process.env.NODE_ENV !== 'production') {
      console.error('⚠️ MONGODB CONNECTION ERROR:', err.message);
    }
    return null;
  }
};

const isDbConnected = () => {
  return Boolean(mongoose.connection && mongoose.connection.readyState === 1);
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.isDbConnected = isDbConnected;

