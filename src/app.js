import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { FRONTEND_URL, MONGO_STRING, PORT } from '../env.js';
import seedPRU from './utils/seeder.js';
import routes from './routes/index.js';

const allowedOrigins = [FRONTEND_URL];
mongoose
  .connect(MONGO_STRING)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log(err));

const app = express();
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan(':date[iso] - :req[X-Real-IP] - :method - :url - :status - :response-time ms'));
app.use('/api', routes);
app.get('/api/seed-PRU', (req, res) => {
  seedPRU();
  return res.json({ message: 'Permissions, Roles and Admins Seeded Successfully!' });
});
app.get('/api/health', (req, res) => {
  res.status(200).send('OK!');
});

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
