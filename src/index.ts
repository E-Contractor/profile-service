import express, { Request, Response } from 'express';
import { connectDB } from './config/db';
import cors from 'cors';
import router from './routes/profile.route';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      'http://localhost:5173',
      /https:\/\/.*\.devtunnels\.ms\/?$/,
    ],
    credentials: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', router);

const startServer = async () => {
  await connectDB();
  console.log('connected');
  app.listen(PORT, () => {
    console.log('Server is running on PORT: ', PORT);
  });
};

startServer();
