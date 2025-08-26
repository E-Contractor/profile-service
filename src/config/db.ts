import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI;

export const connectDB = async() => {
  try {
    const DB_URI = uri;
    if (!DB_URI) {
      throw new Error('DB_URI is noted defined in the environment variables.');
    }

    await mongoose.connect(DB_URI);
    console.log('Connected to database');
  } catch (error: any) {
    console.log(error.message);
  }
}