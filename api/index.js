import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from '../db.js';
import cors from 'cors';
dotenv.config();

import userRoutes from '../routes/userRoutes.js';
//import router from '../routes/accountRoutes.js';
import searchRoutes from '../routes/searchRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
import sheetRoutes from '../routes/sheetRoutes.js';

const app = express();
//connectDb();

app.use(express.json());
//app.use(morgan('dev'));

/**
 * Configure CORS.
 * Replace 'http://your-client-domain.com' with the actual URL (including port) of your frontend.
 * If you want to allow multiple origins, you can use a function to check the incoming origin.
 */
/**
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://fronts-three.vercel.app' : 'http://localhost:5173',
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  optionsSuccessStatus: 200
};
 */
app.use(cors);

// Mount routes
app.use('/', userRoutes);
//app.use('/api/users', userRoutes);
app.use("/api/users", sheetRoutes);

app.use('/api/users/wallet', walletRoutes);

// Simple HTML UI for the root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>Hello World UI</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f0f0f0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello World</h1>
        <p>这是一个由 Express 服务的简单 UI 页面。</p>
        <button onclick="alert('Hello World!')">点击问候</button>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
