import mongoose from 'mongoose';

export const connectDB = async() => {
  try {
    const DB_URI = process.env.MONGO_URI;
    if (!DB_URI) {
      throw new Error('DB_URI is noted defined in the environment variables.');
    }

    await mongoose.connect(DB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    console.log('Connected to database');
  } catch (error: any) {
    console.log(error.message);
  }
}