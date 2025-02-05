import express from 'express';
import cors from 'cors';

import * as auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Public Routes
router.get('/', (req, res) => res.status(200).send("Welcome Page"));
router.post('/users/login', userController.login);

// Apply authentication middleware for all routes defined after this point
router.use(auth.verifyToken);

// Accounts Routes
router.get('/accounts', userController.listAccounts);
router.post('/accounts', userController.createAccount);
router.get('/accounts/:id', userController.showAccount);
router.patch('/accounts/:id', userController.updateAccount);
router.delete('/accounts/:id', userController.deleteAccount);

// Wallet Balance Route (protected by the global auth middleware)
router.get('/users/:id/walletBalance', userController.getWalletBalance);

// File Upload Route
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json(req.file);
});

export default router;
