import express from 'express';
import * as auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

import upload from '../middlewares/multer.js';
import cors from 'cors';

const router = express.Router();
router.use(cors());

router.get('/', (req, res) => {
 res.status(200).send(`
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
//router.use(auth.verifyToken);

router.post('/users/login', userController.login);



// Accounts Routess

router.get('/accounts', userController.listAccounts);
router.post('/accounts', userController.createAccount);
router.get('/accounts/:id', userController.showAccount);
router.patch('/accounts/:id', userController.updateAccount);
router.delete('/accounts/:id', userController.deleteAccount);
router.get('/users/:id/walletBalance', auth.verifyToken, userController.getWalletBalance);
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send(req.file);
});



export default router;
