import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/profile.route';
import cookieParser from 'cookie-parser';
import { buildCorsOptions } from './config/cors';
import { startHttpServer } from './config/server';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(buildCorsOptions()));

app.get('/health', (_req: Request, res: Response) => {
  const mongoUp = mongoose.connection.readyState === 1;
  res.status(mongoUp ? 200 : 503).json({
    success: mongoUp,
    service: 'profile-service',
    mongo: mongoUp ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Profile Service API',
    version: '1.0.0',
  });
});

app.use('/api/profiles', router);

const startServer = async () => {
  await connectDB();
  startHttpServer({
    app,
    port: PORT,
    serviceName: 'profile-service',
    onShutdown: () => mongoose.connection.close(),
  });
};

startServer();
