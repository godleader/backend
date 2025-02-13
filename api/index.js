import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // Re-added morgan for logging (very helpful!)
import cors from 'cors';
//import connectDb from '../db.js';  // Keep this commented out if not using a DB yet

import userRoutes from '../routes/userRoutes.js';
import sheetRoutes from '../routes/sheetRoutes.js';
//import walletRoutes from '../routes/walletRoutes.js';

dotenv.config();

const app = express();

// Database connection (uncomment and configure when needed)
// connectDb(); 

app.use(express.json());
app.use(morgan('dev')); // Use morgan for request logging – invaluable for debugging

// CORS configuration (essential for allowing cross-origin requests)
/*
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://frontend-swart-nu-63.vercel.app' : 'http://localhost:5173', // Replace with your frontend URL
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization', // Add other headers as needed
  credentials: true // Important if you're using cookies or sessions
};
*/


const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://frontend-swart-nu-63.vercel.app'
    : 'http://localhost:5173',
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors());

// Mount route modules – you can change the base paths as necessary
app.use('/', userRoutes);
app.use('/search', sheetRoutes);
// app.use('/users/wallet', wal

// Removed the generic '/' route to prevent conflicts.  Create a specific route for UI.
app.get('/', (req, res) => {  // Example UI route.  Consider a separate /ui route.
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simple UI</title>
    </head>
    <body>
      <h1>Hello from your backend!</h1>
    </body>
    </html>
  `);
});


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));