const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/campusconnect', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('Local MongoDB instance not active. Launching embedded in-memory MongoDB...');
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed demo data if empty
    const User = require('../models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Automatically seeding demo data...');
      const { seedData } = require('../../scripts/seed');
      await seedData(false);
    }
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
