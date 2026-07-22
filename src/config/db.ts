import mongoose from 'mongoose';

const CONNECTION_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }
    await mongoose.connect(uri, CONNECTION_OPTIONS);
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection failed:', (error as Error).message);
  }
};
