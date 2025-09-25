import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import shiftRouter from './routes/shift.route';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.use('/api/users', userRouter);
app.use('/api/shifts', shiftRouter);

// Basic error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);
	res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
