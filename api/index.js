import express from 'express';
import dotenv from 'dotenv';
//import morgan from 'morgan';
//import connectDb from '../db.js';
import cors from 'cors';
dotenv.config();

import userRoutes from '../routes/userRoutes.js';
//import router from '../routes/accountRoutes.js';
import sheetRoutes from '../routes/sheetRoutes.js';
//import walletRoutes from '../routes/walletRoutes.js';

const app = express();
//connectDb();

app.use(express.json());
//app.use(morgan('dev'));

/**
 * Configure CORS.
 * Replace 'http://your-client-domain.com' with the actual URL (including port) of your frontend.
 * If you want to allow multiple origins, you can use a function to check the incoming origin.
 */
const corsOptions = {
  origin: 'https://frontend-swart-nu-63.vercel.app/', // e.g., 'http://localhost:3000'
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow cookies and auth headers
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Mount routes

app.use('/', userRoutes);
app.use('/search', sheetRoutes);

//app.use('/api/users/wallet', walletRoutes);

// Simple HTML UI for the root endpoint


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
