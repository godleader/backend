// index.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDb from '../db.js'; // if needed
dotenv.config();

// Import your routes
import userRoutes from '../routes/userRoutes.js';
import sheetRoutes from '../routes/sheetRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
// import searchRoutes from '../routes/searchRoutes.js'; // if applicable

const app = express();
// connectDb(); // Uncomment if you are using database connection

// Parse JSON bodies from incoming requests.
app.use(express.json());

// Configure CORS with options
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://fronts-three.vercel.app'
      : 'http://localhost:5173',
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Mount your routes. Note the order:
// 1. The sheet routes mounted at /api/users (this will handle /api/users/search)
app.use('/api/users', sheetRoutes);

// 2. Mount wallet routes if needed.
app.use('/api/users/wallet', walletRoutes);

// 3. Other routes – ensure these do not conflict with the above.
// For example, if userRoutes has a catch-all for "/", it might conflict with the above.
// Adjust the mount paths as needed.
app.use('/', userRoutes);

// A simple HTML UI for the root endpoint.
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
