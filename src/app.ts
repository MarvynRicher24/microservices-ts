import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.use(errorHandler);

export default app;
